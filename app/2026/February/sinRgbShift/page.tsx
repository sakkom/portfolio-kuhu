"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sinRgbShiftSketch } from "./sketch";
import { AudioAnalyser } from "@/app/glsl-school/week3/page";

function setThree(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  // const aspect = 4 / 3;
  const aspect = WIDTH / HEIGHT;
  const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.background = null;
  return { scene, camera, renderer };
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothBuffer = useRef(new Float32Array(32));

  useEffect(() => {
    if (!canvasRef.current) return;
    const { scene, camera, renderer } = setThree(canvasRef.current);
    // renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene.background = new THREE.Color(0x000000);
    camera.position.z = 1;

    const sinRgbShift = sinRgbShiftSketch(scene);
    sinRgbShift.init();

    const { ctx: audioCtx, analyser } = AudioAnalyser.init(2048);
    const textureBuffer = new Float32Array(32);
    const dataTexture = new THREE.DataTexture(
      smoothBuffer.current,
      32,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );

    const handleClick = async () => {
      const audio = new Audio("/mix/20260216_224145_E01.wav");

      AudioAnalyser.play(audioCtx, analyser, audio, 500);

      const loop = () => {
        AudioAnalyser.getData(analyser, textureBuffer);
        for (let i = 0; i < textureBuffer.length; i++) {
          smoothBuffer.current[i] =
            smoothBuffer.current[i] * 0.95 + textureBuffer[i] * 0.05;
        }
        dataTexture.needsUpdate = true;

        const props = { audio: dataTexture };

        sinRgbShift.update(props);
        renderer.render(scene, camera);
        requestAnimationFrame(loop);
      };
      loop();
    };
    window.addEventListener("click", handleClick, { once: true });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
