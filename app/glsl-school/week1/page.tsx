"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shader";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    /*initThreeBasic */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfffff0);
    const cam = new THREE.PerspectiveCamera(
      45,
      canvas.width / canvas.height,
      0.1,
      1000,
    );
    cam.position.set(0, 0, 100);
    const light = new THREE.DirectionalLight(0xffffff);
    light.intensity = 5;
    light.position.set(0, 0, 1);
    scene.add(light);

    const positions = [];
    const colors = [];
    const sizes = [];

    // const count = 500;
    // for (let i = 0; i <= count; i++) {
    //   for (let j = 0; j <= count; j++) {
    //     const x = i / count;
    //     const y = j / count;
    //     const signedX = x * 2.0 - 1.0;
    //     const signedY = y * 2.0 - 1.0;

    //     positions.push(signedX, signedY, 0);
    //     colors.push(x, y, 0.5, 1.0);
    //     sizes.push(10.0);
    //   }
    // }
    const space = window.innerWidth / 100;
    for (let i = 0; i <= window.innerWidth; i += space) {
      for (let j = 0; j <= window.innerHeight; j += space) {
        const x = i / window.innerWidth;
        const y = j / window.innerHeight;
        const signedX = x * 2.0 - 1.0;
        const signedY = y * 2.0 - 1.0;

        positions.push(signedX, signedY, 0);
        colors.push(x, y, 0.5, 1.0);
        //1440/1440 のときに0.5pxが基準ポイントサイズ
        sizes.push((window.innerWidth / 1440) * 0.5);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

    const uniforms = {
      uTime: { value: 0.0 },
      uMouse: { value: new THREE.Vector2(0.0, 0.0) },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    window.addEventListener("pointermove", (e) => {
      const x = e.pageX / window.innerWidth;
      const y = e.pageY / window.innerHeight;
      const signedX = x * 2.0 - 1.0;
      const signedY = y * 2.0 - 1.0;
      uniforms.uMouse.value.set(signedX, -signedY);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.uTime.value += 0.0167;
      renderer.render(scene, cam);
    };
    animate();
  }, []);
  return <canvas ref={canvasRef} />;
}
