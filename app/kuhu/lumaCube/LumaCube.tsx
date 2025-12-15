"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { week2Shader } from "./shader";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function LumaCube() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xfffff0);
    scene.background = new THREE.Color(0x000000);
    const cam = new THREE.PerspectiveCamera(
      45,
      canvas.width / canvas.height,
      0.1,
      100,
    );
    cam.position.set(0, 0, 5.0);
    const controls = new OrbitControls(cam, canvas);
    controls.rotateSpeed = 0.2;

    const loader = new THREE.TextureLoader();
    const materials: (THREE.ShaderMaterial | null)[] = new Array(2).fill(null);
    for (let i = 0; i < 2; i++) {
      loader.load("/checker-board.jpg", (tex0) => {
        const aspect = tex0.image.width / tex0.image.height;
        materials[i] = new THREE.ShaderMaterial({
          uniforms: THREE.UniformsUtils.clone(week2Shader.uniforms),
          vertexShader: week2Shader.vertexShader,
          fragmentShader: week2Shader.fragmentShader,
        });
        materials[i]!.uniforms.uResolution.value.set(
          window.innerWidth,
          window.innerHeight,
        );
        materials[i]!.uniforms.uLayer.value = i;
        materials[i]!.uniforms.uTexture0.value = tex0;
        materials[i]!.side = THREE.DoubleSide;
        const geometry = new THREE.PlaneGeometry(2 * aspect, 2, 100, 100);

        const mesh = new THREE.Mesh(geometry, materials[i]!);
        scene.add(mesh);
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      materials.forEach((m) => {
        if (m) {
          m.uniforms.uTime.value += 0.0167;
        }
      });
      controls.update();
      renderer.render(scene, cam);
    };
    animate();
  }, []);
  return <canvas className="article-canvas" ref={canvasRef} />;
}
