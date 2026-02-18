"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  OutputPass,
  RenderPass,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import { AudioAnalyser } from "@/app/audio/util";

const AudioDistortion = {
  uniforms: {
    tDiffuse: { value: null },
    uAudioTexture: { value: null },
    uTime: { value: 0.0 },
    uEnabled: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform sampler2D uAudioTexture;
    uniform float uTime;
    uniform float uEnabled;

    float lumi(vec3 color) {
      return dot(color, vec3(0.3, 0.59, 0.11));
    }

    void main() {
      vec2 uv = vUv;
      float audio = texture2D(uAudioTexture, vec2(uv.x, 0.5)).r;

      vec2 distUv = uv;
      vec3 finalColor = vec3(0.0);
      for (float i = 0.0; i < 30.0; i++) {
        float l = lumi(texture2D(tDiffuse, distUv).rgb);
        distUv.y += audio * 0.015;
        vec3 col = texture2D(tDiffuse, distUv).rgb * l * l * l;
        finalColor += col;
      }
      vec3 finalColorPow = pow(finalColor / 2., vec3(2.));

      vec3 normal = texture2D(tDiffuse, uv).rgb;
      gl_FragColor = vec4(mix(normal, finalColorPow, uEnabled), 1.0);
    }
  `,
};

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const video = document.createElement("video");
    // video.src = "/43/DZ2y7Af5XTeECRUkB--jMCOdgCotEeF2njRSQQBOc48.MP4";
    video.src = "/43/43video11_0218.webm";
    video.loop = false;
    video.muted = true;
    video.playsInline = true;

    video.addEventListener("loadedmetadata", () => {
      const WIDTH = window.innerWidth;
      const HEIGHT = window.innerHeight;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(WIDTH, HEIGHT);
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const scene = new THREE.Scene();

      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.colorSpace = THREE.SRGBColorSpace;

      // ① lumiベース (↑) + walkEffect (←) を1つのShaderMaterialにmix
      const lumiMat = new THREE.ShaderMaterial({
        uniforms: {
          tVideo: { value: videoTexture },
          uTex2: { value: videoTexture }, // 同じ映像
          uTime: { value: 0 },
          uLevel: { value: 0.0 },
          uLevel2: { value: 0.0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          uniform float uLevel;
          uniform float uLevel2;
          uniform sampler2D tVideo;
          uniform sampler2D uTex2;

          float lumi(vec3 color) {
            return dot(color, vec3(0.3, 0.59, 0.11));
          }
          float rand1(float y) {
            return fract(sin(y * 12.9898) * 43758.5453123);
          }
          float rand2(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          vec2 getOffset2(vec2 p) {
            return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
          }
          vec2 getOffset1(float index) {
            return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
          }

          vec3 lumiEffect(vec2 uv) {
            vec3 tex = texture2D(tVideo, uv).rgb;
            float l = lumi(1.0 - tex);
            float lPress = pow(l, 15.0);
            vec3 rgbColor;
            float floorL = floor((1.0 - l) * 20.0);
            rgbColor.r = texture2D(tVideo, uv - getOffset1(floorL) * 1.0).g;
            rgbColor.g = texture2D(tVideo, uv + getOffset1(floorL + 1.234) * 1.0).g;
            rgbColor.b = texture2D(tVideo, uv + getOffset1(floorL + 5.678) * 1.0).g;
            float rLumi = lumi(rgbColor);
            if(rLumi > 0.35) {
              rgbColor = 1.0 - rgbColor;
            } else {
              rgbColor = pow(rgbColor, vec3(100.0));
            }
            rgbColor = mix(vec3(1.0), rgbColor, 1.0);
            vec3 finalColor = vec3(lPress) + pow(rgbColor, vec3(10.0)) * 10.0;
            float finalColorLumi = lumi(finalColor);
            return mix(tex, vec3(finalColorLumi), uLevel);
          }
          vec2 rotatePos(vec2 p, float a) {
            return p * mat2(cos(a), -sin(a), sin(a), cos(a));
          }

          vec3 walkEffect(vec2 uv) {
            vec2 blockUv = uv;
            // blockUv.y += (rand1(floor(uTime * 10.)) - 0.5) * 2.0;
            blockUv += (rand1(floor(uTime * 20.)) - 0.5) * .5;
            vec3 tex = texture2D(uTex2, blockUv).rgb;
            float l = lumi(1. - tex);
            return vec3(pow(1. - l, 2.5));
          }

          vec3 sinDistoretion(vec2 uv) {
            vec2 sinUv = uv;
            // sinUv.x += floor(sin(uv.x * 30.0 + uTime) * 5.)  * 0.05;
            // sinUv.y += sin(uv.x * 30.0 + uTime) * 0.01;
            float dist = length(sinUv - .5);
            // float a = atan(sinUv.y - .5, sinUv.x -.5);
            // sinUv = rotatePos(sinUv, rand2(dist));
            vec2 noiseUv = uv;
            noiseUv.x += getOffset1(rand1(floor(noiseUv.y * 5.)) + uTime).y * 0.1;
            vec3 tex = texture2D(uTex2, noiseUv).rgb;

            vec3 shiftTex;
            shiftTex.r =  texture2D(uTex2, uv + vec2(0, 0.1)).r;
            shiftTex.g =  texture2D(uTex2, uv).r;
            shiftTex.b =  texture2D(uTex2, uv - vec2(0, 0.1)).r;
            return vec3(shiftTex);
          }

          void main() {
            vec3 lumi = lumiEffect(vUv);
            vec3 walk = walkEffect(vUv);
            vec3 sinDist = sinDistoretion(vUv);
            gl_FragColor = vec4(mix(lumi, walk, uLevel2), 1.0);
            // gl_FragColor = vec4(mix(lumi, sinDist, uLevel2), 1.0);
          }
        `,
      });

      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), lumiMat));

      // ② Composer + AudioDistortion (↓キー)
      const composer = new EffectComposer(renderer);
      composer.setPixelRatio(window.devicePixelRatio);
      composer.setSize(WIDTH, HEIGHT);
      composer.addPass(new RenderPass(scene, camera));

      const distortionPass = new ShaderPass(AudioDistortion);
      composer.addPass(distortionPass);
      composer.addPass(new OutputPass());

      // Audio
      const { ctx: audioCtx, analyser } = AudioAnalyser.init(2048);
      const textureBuffer = new Float32Array(256);
      const dataTexture = new THREE.DataTexture(
        textureBuffer,
        256,
        1,
        THREE.RedFormat,
        THREE.FloatType,
      );

      // 録画
      const audioDest = audioCtx.createMediaStreamDestination();
      const recordStream = new MediaStream([
        ...canvas.captureStream().getVideoTracks(),
        ...audioDest.stream.getAudioTracks(),
      ]);
      let recorder: MediaRecorder | null = null;
      let chunks: Blob[] = [];

      // キー操作
      window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") lumiMat.uniforms.uLevel.value = 1.0;
        if (e.key === "ArrowDown") distortionPass.uniforms.uEnabled.value = 1.0;
        if (e.key === "ArrowLeft") lumiMat.uniforms.uLevel2.value = 1.0;
      });
      window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowUp") lumiMat.uniforms.uLevel.value = 0.0;
        if (e.key === "ArrowDown") distortionPass.uniforms.uEnabled.value = 0.0;
        if (e.key === "ArrowLeft") lumiMat.uniforms.uLevel2.value = 0.0;
      });

      // R: 録画停止
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "r" || e.key === "R") &&
          recorder?.state === "recording"
        ) {
          recorder.stop();
        }
      });

      const clock = new THREE.Clock();

      let counter = 0;
      const loop = () => {
        const time = clock.getElapsedTime();
        lumiMat.uniforms.uTime.value = time;
        distortionPass.uniforms.uTime.value = time;

        if (counter % 2 == 0) {
          if (Math.random() > 0.98) {
            lumiMat.uniforms.uLevel.value = Math.random();
          }
          if (Math.random() > 0.98) {
            distortionPass.uniforms.uEnabled.value = Math.random();
          }
          if (Math.random() > 0.98) {
            lumiMat.uniforms.uLevel2.value = Math.random();
          }
        }

        AudioAnalyser.getData(analyser, textureBuffer);
        dataTexture.needsUpdate = true;
        distortionPass.uniforms.uAudioTexture.value = dataTexture;
        composer.render();
        requestAnimationFrame(loop);
        counter++;
      };

      window.addEventListener(
        "click",
        () => {
          audioCtx.resume();
          video.muted = false;
          const source = audioCtx.createMediaElementSource(video);
          source.connect(analyser);
          analyser.connect(audioCtx.destination);
          source.connect(audioDest);
          video.play();
          loop();

          chunks = [];
          recorder = new MediaRecorder(recordStream, {
            mimeType: "video/webm; codecs=vp9,opus",
            videoBitsPerSecond: 20_000_000,
            audioBitsPerSecond: 320_000,
          });
          // recorder.start(500);
          recorder.ondataavailable = (ev) => chunks.push(ev.data);
          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `rec_${Date.now()}.webm`;
            a.click();
          };
        },
        { once: true },
      );

      video.addEventListener("ended", () => {
        if (recorder?.state === "recording") recorder.stop();
      });
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", margin: 0, padding: 0 }}
    />
  );
}
