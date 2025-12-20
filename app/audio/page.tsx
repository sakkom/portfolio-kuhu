"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { time } from "three/src/nodes/TSL.js";

const notes = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    /*web audio api */
    const ctx = new AudioContext();
    const speaker = ctx.destination;

    // const osc = ctx.createOscillator();
    const analyser = ctx.createAnalyser();

    // osc.connect(analyser);
    analyser.connect(speaker);

    // const timeData = new Float32Array(analyser.fftSize);
    analyser.fftSize = 512; //11
    const timeData = new Float32Array(analyser.fftSize);
    const timeTexture512 = new Float32Array(512 * 512);

    /*three */
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(512, 512);

    const dataTexture = new THREE.DataTexture(
      timeTexture512,
      512,
      512,
      THREE.RedFormat,
      THREE.FloatType,
    );
    dataTexture.needsUpdate = true;

    const material = new THREE.ShaderMaterial({
      uniforms: { uAudioTexture: { value: dataTexture } },
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

        void main() {
          vec2 uv = vUv;

          float wave = texture2D(uAudioTexture, vec2(uv.x)).r;

          float amp = 0.2;
          float offset = 0.5;
          float y = wave * amp + offset;

          float length = length(uv - 0.5);

          float dist = abs(uv.y - y);
          float mono = step(dist, 0.01);
          mono = 1.0 - mono;
          float addDist = smoothstep(1.0, -0.0, dist);
          addDist = 1.0 - addDist;

          vec3 finalColor = vec3(mono + addDist );


          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let refId = 0;
    const clock = new THREE.Clock();

    let counter = 511;
    const handleClick = () => {
      ctx.resume();
      const audio = new Audio("/audio/audio-01.mp3");
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      audio.play();

      const loop = () => {
        // const t = clock.getElapsedTime();
        // const noteI = Math.floor(t) % notes.length;
        // osc.frequency.value = notes[noteI];
        analyser.getFloatTimeDomainData(timeData);

        /*three */
        timeTexture512.set(timeData, counter * 512);
        counter--;
        if (counter < 0) counter = 511;

        dataTexture.needsUpdate = true;
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

  return <canvas ref={canvasRef} />;
}
