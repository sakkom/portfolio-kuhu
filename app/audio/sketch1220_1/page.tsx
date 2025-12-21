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
    analyser.fftSize = 32;
    const timeData = new Float32Array(analyser.fftSize);
    const timeTexture512 = new Float32Array(
      analyser.fftSize * analyser.fftSize,
    );

    /*three */
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(512, 512);

    const dataTexture = new THREE.DataTexture(
      timeTexture512,
      analyser.fftSize,
      analyser.fftSize,
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

        void main() {
          vec2 uv = vUv;

          vec2 pos = uv;
          // pos.x = pos.x * 5.0;

          for(float i = 0.0; i < 100.0; i++) {
          //[-1, 1]
            float noise = texture2D(uAudioTexture, pos).r;
            //[0, 1]
            noise = (noise + 1.0) * 0.5;
            //高音倍増
            noise *= 5.0;

            float angle = noise * 6.28;
            vec2 filedDir = vec2(cos(angle), sin(angle));
            pos += filedDir * 0.05;

            // pos += filedDir * 0.1;
            // pos = pos.yx;
          }

          float dist = length(pos - uv);
          float color = step(dist, fract(uTime));
          // float color = step(dist, 0.5);

          gl_FragColor = vec4(vec3(color), 1.0);
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
      const audio = new Audio("/audio/audio-01.mp3");
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      audio.play();

      const loop = () => {
        // const t = clock.getElapsedTime();
        // const noteI = Math.floor(t) % notes.length;
        // osc.frequency.value = notes[noteI];
        analyser.getFloatTimeDomainData(timeData);
        console.log(timeData);

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

  return <canvas ref={canvasRef} />;
}
