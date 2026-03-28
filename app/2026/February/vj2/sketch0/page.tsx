"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
  OutputPass,
} from "three/examples/jsm/Addons.js";
import { AudioAnalyser } from "@/app/audio/util";
import { vj2CurveOscillator } from "./osillator4";
import { BpmDetector } from "@/app/data/bpm/two/bpmDetector";
import { vj2Radial } from "./projection";
import { vj2Grid } from "./grid";
import { vj2Horizontal } from "./horizontal";
import { vj2CirclePacking2 } from "./ciclePacking2";
import { vj2SinWave } from "./sinwave";
import { vj2Smoothwave } from "./smoothwave";
import { vj2PhotoMusic } from "./photomusic";
import { vj2Sea } from "./sea";
import { vj2Matsu } from "./masu";
import { NegaShader } from "@/app/vj/vol1/postProcessing/negaPos";
import { v1Glitch0 } from "@/app/vj/vol1/postProcessing/glitchVj1";
import { ColorShader } from "@/app/vj/vol1/postProcessing/colorShader";
import { vj2Treflip } from "./treflip";
import { vj2Walk } from "./walk";
import { vj2CircleTree } from "./circleTree";
import { ShuffleUv } from "../effector/shuffle";
import { ShiftUv } from "../effector/shift";
import { vj2sinRgbShiftSketch } from "./sinRgbShift";
import { vj2Suzuki } from "./suzuki";
import { vj2CirclePacking } from "./circlePacking";
import { vj3Morph } from "../../vj3/morph";
import { vj3Morph2 } from "../../vj3/morph2";
import { vj3Osi } from "../../vj3/osi";
import { vj3Metaball } from "../../vj3/metaball";
import { vj3TwoDAudio } from "../../vj3/twoDAudio";
import { vj3AudioBlock } from "../../vj3/audioBlock";

interface Scene {
  sketch: {
    mesh: THREE.Object3D;
    init: () => void;
    update: (props: any) => void;
  };
  pad: number;
  active: boolean;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoOpacityRef = useRef<number>(0);
  const logoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const smoothBuffer32 = useRef(new Float32Array(32));

  useEffect(() => {
    if (!canvasRef.current) return;
    const clock = new THREE.Clock();
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    const aspect = WIDTH / HEIGHT;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -aspect,
      aspect,
      1,
      -1,
      0.1,
      100,
    );
    camera.position.z = 1;
    const light = new THREE.DirectionalLight(0xffffff, 10);
    light.position.set(0, 0, 0.01);
    scene.add(light);

    const feedbackScene = new THREE.Scene();
    const feedbackCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const dpr = renderer.getPixelRatio();
    const rtW = Math.floor(WIDTH * dpr);
    const rtH = Math.floor(HEIGHT * dpr);
    const sketchTarget = new THREE.WebGLRenderTarget(rtW, rtH);
    const targetA = new THREE.WebGLRenderTarget(rtW, rtH);
    const targetB = new THREE.WebGLRenderTarget(rtW, rtH);

    const feedbackMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tCurrent: { value: null },
        tPrev: { value: null },
        uTime: { value: 0 },
        uLevel0: { value: 0.0 },
        uLevel1: { value: 0.0 },
        uLevel2: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D tCurrent;
        uniform sampler2D tPrev;
        uniform float uLevel0;
        uniform float uLevel1;
        uniform float uLevel2;
        float rand2(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        vec2 getOffset2(vec2 p) { return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5); }
        void main() {
          vec2 uv = vUv;
          vec3 current = texture2D(tCurrent, uv).rgb;
          vec3 prev = texture2D(tPrev, uv).rgb;
          vec2 blockUv = floor(uv * 100.) / 100.;
          vec2 noiseUv = uv + getOffset2(blockUv) * 0.01;
          vec3 noisePrev = texture2D(tPrev, noiseUv).rgb;
          vec3 color = current + noisePrev * clamp(length(noisePrev), 0.97, 0.99);
          vec3 color1 = mix(prev, current, step(0.5, length(current)));
          vec3 colorCaos = mix((uLevel2 - prev) * 0.9999, current, step(0.8, length(current)));
          vec3 result = current;
          result = mix(result, color, uLevel0);
          result = mix(result, color1, uLevel1);
          result += colorCaos * uLevel2;

          gl_FragColor = vec4(result, 1.0);
        }
      `,
    });
    feedbackScene.add(
      new THREE.Mesh(new THREE.PlaneGeometry(2, 2), feedbackMaterial),
    );

    const outputScene = new THREE.Scene();
    const outputCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const outputMaterial = new THREE.MeshBasicMaterial({ map: null });
    outputScene.add(
      new THREE.Mesh(new THREE.PlaneGeometry(2, 2), outputMaterial),
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(outputScene, outputCamera));
    const negaPass = new ShaderPass(NegaShader);
    composer.addPass(negaPass);
    const glitchPass = new ShaderPass(v1Glitch0);
    composer.addPass(glitchPass);
    const colorPass = new ShaderPass(ColorShader);
    composer.addPass(colorPass);
    const shufflePass = new ShaderPass(ShuffleUv);
    composer.addPass(shufflePass);
    const shiftPass = new ShaderPass(ShiftUv);
    composer.addPass(shiftPass);
    composer.addPass(new OutputPass());

    const scenes: Scene[] = [
      { sketch: vj2Sea(scene), pad: 36, active: false },
      { sketch: vj2Matsu(scene), pad: 37, active: false },
      { sketch: vj2Suzuki(scene), pad: 38, active: false },
      { sketch: vj2Treflip(scene), pad: 39, active: false },
      { sketch: vj2PhotoMusic(scene), pad: 40, active: false },
      { sketch: vj2SinWave(scene), pad: 41, active: false },
      { sketch: vj2Horizontal(scene), pad: 42, active: false },
      { sketch: vj2Grid(scene), pad: 43, active: false },
      { sketch: vj2CirclePacking2(scene), pad: 44, active: false },
      { sketch: vj2CurveOscillator(scene), pad: 45, active: false },
      { sketch: vj2Smoothwave(scene), pad: 46, active: false },
      { sketch: vj2Radial(scene), pad: 47, active: false },
      { sketch: vj2CircleTree(scene), pad: 48, active: false },
      { sketch: vj2sinRgbShiftSketch(scene), pad: 49, active: false },
      { sketch: vj3Morph(scene), pad: 52, active: false },
      { sketch: vj3Morph2(scene), pad: 53, active: false },
      { sketch: vj3Osi(scene), pad: 54, active: false },
      { sketch: vj3Metaball(scene), pad: 55, active: false },
      { sketch: vj3TwoDAudio(scene), pad: 56, active: false },
      { sketch: vj3AudioBlock(scene), pad: 57, active: false },
    ];

    scenes.forEach((s) => {
      s.sketch.init();
      s.sketch.mesh.visible = false;
    });

    const bpmDetector = BpmDetector.createBpm();
    const audioContext = bpmDetector.init();
    const streamDest = audioContext.ctx.createMediaStreamDestination();
    audioContext.analyser.connect(audioContext.ctx.destination);
    audioContext.analyser.connect(streamDest);

    const oscillatorBuffer = new Float32Array(1024);
    const projectionBuffer = new Float32Array(256);
    const sinRgbShiftBuffer = new Float32Array(32);
    const dataTexture = new THREE.DataTexture(
      smoothBuffer32.current,
      32,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );

    let flip = false;
    let bpmCounter = 0;

    navigator.requestMIDIAccess?.().then((access) => {
      access.inputs.forEach((input) => {
        input.onmidimessage = (m) => {
          if (!m.data) return;
          const [status, note, value] = m.data;
          const level = value / 127;
          const VIDEO_PADS = new Set([36, 37, 38, 39, 40]);

          if (status === 153) {
            if (note === 51) {
              const current = logoOpacityRef.current;
              logoOpacityRef.current = current > 0 ? 0 : 1;
            }

            const target = scenes.find((s) => s.pad === note);
            if (target) {
              if (VIDEO_PADS.has(note)) {
                scenes.forEach((s) => {
                  if (VIDEO_PADS.has(s.pad) && s.pad !== note) {
                    s.active = false;
                    s.sketch.mesh.visible = false;
                  }
                });
              }
              target.active = !target.active;
              target.sketch.mesh.visible = target.active;
            }
          }
          if (status === 176) {
            if (note === 3) shiftPass.uniforms.uLevel.value = level;
            if (note === 9) feedbackMaterial.uniforms.uLevel1.value = level;
            if (note === 12) feedbackMaterial.uniforms.uLevel2.value = level;
            if (note === 13) negaPass.uniforms.uLevel.value = level;
            if (note === 14) glitchPass.uniforms.uLevel.value = level;
            if (note === 15) shufflePass.uniforms.uLevel.value = level;
          }
        };
      });
    });

    const toggleRec = () => {
      if (!recorderRef.current || recorderRef.current.state === "inactive") {
        const stream = new MediaStream([
          ...canvasRef.current!.captureStream(60).getTracks(),
          ...streamDest.stream.getAudioTracks(),
        ]);
        recorderRef.current = new MediaRecorder(stream, {
          mimeType: "video/webm; codecs=vp9,opus",
        });
        chunksRef.current = [];
        recorderRef.current.ondataavailable = (e) =>
          chunksRef.current.push(e.data);
        recorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `vj-rec-${Date.now()}.webm`;
          a.click();
        };
        recorderRef.current.start();
        console.log("REC START");
      } else {
        recorderRef.current.stop();
        console.log("REC STOP");
      }
    };
    const handleS = (e: KeyboardEvent) => {
      if (e.key === "s") toggleRec();
    };
    window.addEventListener("keydown", handleS);

    const loop = () => {
      if (canvasRef.current) canvasRef.current.style.zIndex = "0";
      // console.log(canvasRef.current?.style.cssText);
      const time = clock.getElapsedTime();
      AudioAnalyser.getData(audioContext.analyser, oscillatorBuffer);
      AudioAnalyser.getData(audioContext.analyser, projectionBuffer);
      AudioAnalyser.getData(audioContext.analyser, sinRgbShiftBuffer);
      for (let i = 0; i < sinRgbShiftBuffer.length; i++) {
        smoothBuffer32.current[i] =
          smoothBuffer32.current[i] * 0.95 + sinRgbShiftBuffer[i] * 0.05;
      }
      dataTexture.needsUpdate = true;

      const bpm = bpmDetector.update(time);
      // const bpm = 120;
      // const bpm = (time * 10) % 50;

      for (let i = 0; i < oscillatorBuffer.length; i++) {
        oscillatorBuffer[i] = oscillatorBuffer[i] * 1;
      }
      for (let i = 0; i < projectionBuffer.length; i++) {
        projectionBuffer[i] = projectionBuffer[i] * 1;
      }

      const bpmCount = Math.floor((bpm / 60) * time);
      const onBeat = bpm > 0 && bpmCount !== bpmCounter;
      if (bpmCounter !== bpmCount) bpmCounter = bpmCount;

      const props = {
        onBeat,
        oscillatorBuffer,
        projectionBuffer,
        bpmCount,
        time,
        bpm,
        audio: dataTexture,
        analyser: audioContext.analyser,
      };

      scenes.forEach((s) => {
        if (s.active) s.sketch.update(props);
      });

      const readBuffer = flip ? targetA : targetB;
      const writeBuffer = flip ? targetB : targetA;

      renderer.setRenderTarget(sketchTarget);
      renderer.render(scene, camera);

      feedbackMaterial.uniforms.uTime.value = time;
      feedbackMaterial.uniforms.tCurrent.value = sketchTarget.texture;
      feedbackMaterial.uniforms.tPrev.value = readBuffer.texture;
      renderer.setRenderTarget(writeBuffer);
      renderer.render(feedbackScene, feedbackCamera);

      outputMaterial.map = writeBuffer.texture;
      glitchPass.uniforms.uTime.value = time;
      colorPass.uniforms.uTime.value = time;
      shufflePass.uniforms.uTime.value = time;
      shufflePass.uniforms.uBpmCount.value = Math.floor(
        ((bpm * 4) / 60) * time,
      );
      shiftPass.uniforms.uTime.value = time;
      shiftPass.uniforms.uBpmCount.value = Math.floor(((bpm * 2) / 60) * time);
      composer.render();

      flip = !flip;

      if (logoRef.current) {
        const current = parseFloat(logoRef.current.style.opacity || "0");
        const target = logoOpacityRef.current;
        const next = current + (target - current) * 0.08;
        logoRef.current.style.opacity = String(next);
      }
      requestAnimationFrame(loop);
    };

    const handleClick = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioinputs = devices.filter((d) => d.kind == "audioinput");
      console.log(audioinputs);
      const ipod = audioinputs.find((d) => d.label.includes("USB Audio"));
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: ipod?.deviceId },
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });
      // console.log(stream);
      // const audio = new Audio("/mix/20260216_224145_E01.wav");
      const audio = new Audio("/vj3/A面B面.wav");
      audio.loop = true;
      audio.onloadedmetadata = () => {
        AudioAnalyser.play(audioContext.ctx, audioContext.analyser, audio, 0);
        loop();
      };

      logoRef.current?.play();
    };
    window.addEventListener("click", handleClick, { once: true });

    return () => {
      window.removeEventListener("keydown", handleS);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "block",
          zIndex: 0,
        }}
      />
      <video
        ref={logoRef}
        src="/43/9jXXwsury5SanuLzW7mNSkdjnjP6lMRjOfO7xSq8kB0.MP4"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "30%",
          height: "auto",
          objectFit: "contain",
          mixBlendMode: "screen",
          pointerEvents: "none",
          display: "block",
          opacity: 0,
          zIndex: 1000,
        }}
        loop
        muted
        playsInline
      />
    </div>
  );
}
