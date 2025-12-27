"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { pinponShader } from "./shader";
import { createMyname } from "@/app/texts/myName/page";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const w = 512,
      h = 512;
    canvasRef.current.width = w;
    canvasRef.current.height = h;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    // renderer.setSize(512, 512);

    const option = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.UnsignedByteType,
    };
    let bufferA = new THREE.WebGLRenderTarget(w, h, option);
    let bufferB = new THREE.WebGLRenderTarget(w, h, option);

    // const video = document.createElement("video");
    // video.src = "/videos/cat.mp4";
    // video.muted = true;
    // video.loop = true;
    // video.play();
    // const videoTex = new THREE.VideoTexture(video);

    const myNameTex = new THREE.CanvasTexture(createMyname());

    const material = new THREE.ShaderMaterial(pinponShader);
    const geometry = new THREE.PlaneGeometry(2, 2, 10, 10);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const loop = () => {
      // material.uniforms.uVideo.value = videoTex;
      material.uniforms.uMyname.value = myNameTex;
      material.uniforms.uTime.value += 0.0167;
      material.uniforms.uPrevTex.value = bufferA.texture;
      renderer.setRenderTarget(bufferB);
      renderer.render(scene, camera);

      renderer.setRenderTarget(null);
      renderer.render(scene, camera);

      [bufferA, bufferB] = [bufferB, bufferA];
      requestAnimationFrame(loop);
    };
    loop();
  }, []);

  return <canvas ref={canvasRef} />;
}
