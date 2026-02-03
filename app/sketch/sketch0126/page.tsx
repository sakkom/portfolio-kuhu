"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sketch0126Shader } from "./main";

function setThree(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
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

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!canvasRef.current) return;
    const { scene, camera, renderer } = setThree(canvasRef.current);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 1;

    const video = document.createElement("video");
    video.src = "/videos/cat.mp4";
    // video.src = "/videos/vj1/34091-399913636_small.mp4";
    // video.src = "/videos/vj1/2799-162896272_large.mp4";
    video.loop = true;
    video.muted = true;
    video.play();

    const videoTex = new THREE.VideoTexture(video);
    let videoMaterial: THREE.ShaderMaterial | null = null;
    video.addEventListener("loadedmetadata", () => {
      const videoAspect = video.videoWidth / video.videoHeight;
      const geometry = new THREE.PlaneGeometry(2, 2, 100, 100);
      videoMaterial = new THREE.ShaderMaterial(sketch0126Shader);
      videoMaterial.uniforms.uTexture0.value = videoTex;
      videoMaterial!.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight,
      );
      const mesh = new THREE.Mesh(geometry, videoMaterial);
      scene.add(mesh);
    });

    const clock = new THREE.Clock();
    const loop = () => {
      if (videoMaterial) {
        videoMaterial.uniforms.uTime.value = clock.getElapsedTime();
      }

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
      <canvas ref={canvasRef} />
    </div>
  );
}
