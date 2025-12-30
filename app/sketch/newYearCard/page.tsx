"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { newYearShader } from "./shader";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    const loader = new THREE.TextureLoader();
    const horse = loader.load("/43738.jpg");

    const video = document.createElement("video");
    video.src = "/videos/232968_small.mp4";
    video.loop = true;
    video.muted = true;
    video.play();
    const videoTex = new THREE.VideoTexture(video);

    const material = new THREE.ShaderMaterial(newYearShader);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // material.uniforms.uTex.value = horse;
    material.uniforms.uTex.value = videoTex;

    const clock = new THREE.Clock();
    const loop = () => {
      material.uniforms.uTime.value += clock.getDelta();
      material.uniforms.uTex.value = videoTex;

      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
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
        width={512}
        height={512}
        // style={{ border: "1px solid white" }}
      />
    </div>
  );
}
