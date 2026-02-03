"use client";

import { AudioAnalyser } from "@/app/audio/util";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { add } from "three/examples/jsm/libs/tween.module.js";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const clock = new THREE.Clock();
    const { ctx, analyser, buffer } = AudioAnalyser.init(128);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1 / 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    scene.background = new THREE.Color(0x000000);
    camera.position.z = 1;
    const light = new THREE.DirectionalLight(0xffffff, 10);
    light.position.set(0, 0, 0.01);
    scene.add(light);
    const controls = new OrbitControls(camera, canvasRef.current);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerHeight, window.innerHeight);

    function randJs(seed: number) {
      const x = Math.sin(seed * 12.9898) * 43758.5453123;
      return x - Math.floor(x);
    }

    const lines: Line2[] = [];
    const loopNum = 128;
    for (let i = 0; i < loopNum; i++) {
      const geometry = new LineGeometry();
      const material = new LineMaterial({
        color: new THREE.Color().setHSL(0.0, 0.0, i > loopNum / 2 ? 1 : 1),
        linewidth: Math.random() * 2,
      });
      const line = new Line2(geometry, material);

      scene.add(line);

      lines.push(line);
    }
    // scene.rotateZ(1.57);

    const handleClick = async () => {
      // const audio = new Audio("/audio/audio_clean.wav");
      const audio = new Audio("/audio/audio-01.mp3");
      // const audio = new Audio(
      //   "/audio/sample-pack-link-in-bio-dopetronic-aliens-in-my-basement-331356.mp3",
      // );
      AudioAnalyser.play(ctx, analyser, audio, 0);

      let counter = 0;
      const loop = () => {
        const time = clock.getElapsedTime();
        if (counter % 5 == 0.0) {
          AudioAnalyser.getData(analyser, buffer);
        }

        for (let i = 0; i < loopNum; i++) {
          const normalI = i / (loopNum - 1);
          const target = new THREE.Vector3(
            normalI * 1.0 - 0.5,
            buffer[i] * 0.5,
            0,
          );
          const center = new THREE.Vector3(0, 0.0, 0);

          lines[i].geometry.setFromPoints([center, target]);
        }

        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(loop);
        counter++;
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
        minHeight: "100vh",
      }}
    >
      <canvas
        ref={canvasRef}
        width={1024}
        height={1024}
        // style={{ border: "1px solid white" }}
      />
    </div>
  );
}
