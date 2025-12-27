"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    /*web audio api */
    const ctx = new AudioContext();
    const speaker = ctx.destination;

    // const osc = ctx.createOscillator();
    const analyser = ctx.createAnalyser();
    analyser.smoothingTimeConstant = 1.0;

    // osc.connect(analyser);
    analyser.connect(speaker);

    // const timeData = new Float32Array(analyser.fftSize);
    analyser.fftSize = 256;
    const timeData = new Float32Array(analyser.fftSize);
    const timeTexture512 = new Float32Array(
      analyser.fftSize * analyser.fftSize,
    );

    /*three */
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(512 * 2, 512 * 2);

    const dataTexture = new THREE.DataTexture(
      timeData,
      analyser.fftSize,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );
    dataTexture.needsUpdate = true;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uAudioTexture: { value: dataTexture },
        uTime: { value: null },
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
        uniform sampler2D uAudioTexture;
        uniform float uTime;

        float sdCircle(vec2 pos, float radius) {
          return length(pos) - radius;
        }

        float rand2(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        vec3 hsl2rgb(vec3 hsl) {
          float h = hsl.x;
          float s = hsl.y;
          float l = hsl.z;

          vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
        }

        float rand1(float y) {
          return fract(sin(y * 12.9898) * 43758.5453123);
        }

        void main() {
        vec2 uv = vUv;

        vec2 pos = uv;
        vec3 col = vec3(0.0);
        float numSamples = 2000.0;

        for(float i = 0.0; i < numSamples; i++) {
          float ni = (i) / numSamples;
          float sampleY = texture2D(uAudioTexture, vec2(ni, 0.5)).r * 0.5 + 0.5;
          float offsetNoise = texture2D(uAudioTexture, vec2((1.0 -ni), 0.5)).r * 0.5 + 0.5;

          vec2 offset = vec2(sampleY, offsetNoise - ni);
          vec2 sampleUv = uv - offset;
          float ball = sdCircle(sampleUv, 1.0 * ni);

          vec3 circleColor = hsl2rgb(vec3(0.0, 0.0, pow(i / numSamples, 0.2)));
          circleColor = 1.0 - circleColor;
          vec3 c = circleColor * smoothstep(0.001, -0.0, abs(ball));
          col += c;
        }
        gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let refId = 0;
    const clock = new THREE.Clock();

    let counter = 0;
    const handleClick = () => {
      ctx.resume();
      const audio = new Audio("/audio/audio-02.mp3");
      // const audio = new Audio("/audio/o_o_out_on_Wisdom_Teeth.mp3");
      // const audio = new Audio("/audio/A1_Alright_DIRT082.mp3");
      // const audio = new Audio("/audio/OvO - Jeremy Black.mp3");
      // const audio = new Audio("/audio/OvO - Jeremy Black.mp3");
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      audio.playbackRate = 1.0;
      audio.currentTime = 0.0;
      audio.play();

      const loop = () => {
        analyser.getFloatTimeDomainData(timeData);

        /*three */
        timeTexture512.set(timeData, counter * analyser.fftSize);
        counter++;
        if (counter >= analyser.fftSize) counter = 0;

        dataTexture.needsUpdate = true;
        material.uniforms.uTime.value += 0.167;
        renderer.render(scene, camera);

        refId = requestAnimationFrame(loop);
      };
      loop();
    };

    window.addEventListener("click", handleClick, { once: true });
    return () => {
      cancelAnimationFrame(refId);
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
