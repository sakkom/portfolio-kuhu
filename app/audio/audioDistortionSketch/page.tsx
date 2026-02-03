"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  OutputPass,
  RenderPass,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import { AudioDistortion } from "@/app/vj/vol1/postProcessing/audioDistorsion";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(window.devicePixelRatio);
    composer.setSize(window.innerWidth, window.innerHeight);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const audioDistortionPass = new ShaderPass(AudioDistortion);
    composer.addPass(audioDistortionPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    const video = document.createElement("video");
    // video.src = "/videos/cat.mp4";
    video.src = "/videos/vj1/2799-162896272_large.mp4";
    video.loop = true;
    video.muted = true;
    video.play();

    const videoTex = new THREE.VideoTexture(video);
    const material = new THREE.MeshBasicMaterial({ map: videoTex });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.connect(ctx.destination);
    const timeBuffer = new Float32Array(analyser.fftSize);

    const dataTexture = new THREE.DataTexture(
      timeBuffer,
      1024,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );
    dataTexture.needsUpdate = true;

    const handleClick = () => {
      ctx.resume();
      const audio = new Audio("/audio/audio-01.mp3");
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      audio.play();

      const loop = () => {
        analyser.getFloatTimeDomainData(timeBuffer);

        audioDistortionPass.uniforms.uAudioTexture.value = dataTexture;
        dataTexture.needsUpdate = true;
        audioDistortionPass.uniforms.uTime.value += 0.0167;
        // renderer.render(scene, camera);
        composer.render();

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
        height: "100vh",
      }}
    >
      <canvas
        ref={canvasRef}
        height={512 * 2}
        width={512 * 2}
        style={{ border: "2px solid green" }}
      />
    </div>
  );
}
