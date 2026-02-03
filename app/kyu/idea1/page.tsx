"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { BpmDetector } from "@/app/data/bpm/two/bpmDetector";
import { AudioAnalyser } from "@/app/audio/util";
import {
  EffectComposer,
  OutputPass,
  RenderPass,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import { AudioDistortionIdea1 } from "./shader";

function setThree(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  // renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.background = null;
  return { scene, camera, renderer };
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { scene, camera, renderer } = setThree(canvasRef.current);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    camera.position.z = 1;
    const controls = new OrbitControls(camera, canvasRef.current);

    const composer = new EffectComposer(renderer);
    // composer.setPixelRatio(window.devicePixelRatio);
    composer.setPixelRatio(1);
    composer.setSize(window.innerWidth, window.innerHeight);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const audioDistortionPass = new ShaderPass(AudioDistortionIdea1);
    composer.addPass(audioDistortionPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    const video = document.createElement("video");
    // video.src = "/videos/cat.mp4";
    video.src = "/audio/Hull.mp4";
    video.loop = true;
    video.currentTime = 0;
    video.muted = true;

    // video.addEventListener("loadedmetadata", () => {
    const videoTex = new THREE.VideoTexture(video);
    videoTex.colorSpace = THREE.SRGBColorSpace;
    const aspect = video.videoWidth / video.videoHeight;
    const material = new THREE.MeshBasicMaterial({ map: videoTex });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    video.play();
    // });
    // video.load();

    /*audio distorstion */
    const textureBuffer = new Float32Array(64);
    const dataTexture = new THREE.DataTexture(
      textureBuffer,
      64,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );
    dataTexture.needsUpdate = true;

    const bpmDetector = BpmDetector.createBpm();
    const audioContext = bpmDetector.init();
    const buffer = new Float32Array(2048);

    const stream = canvasRef.current.captureStream(30);
    let recoder: MediaRecorder;

    const clock = new THREE.Clock();
    let counter = 0;

    const handleClick = async () => {
      // if (videoRef.current) {
      //   videoRef.current.currentTime = 76;
      //   videoRef.current.play();
      // }

      const audio = new Audio("/audio/audio_clean.wav");
      const recoder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8",
        videoBitsPerSecond: 2500000,
      });

      const chuck: Blob[] = [];
      recoder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size) {
          chuck.push(e.data);
        }
      };

      recoder.onstop = () => {
        const blob = new Blob(chuck, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "kyu_sketch1.webm";
        a.click();
        URL.revokeObjectURL(url);
      };
      // recoder.start();
      // setTimeout(() => {
      //   recoder.stop();
      // }, 35000);
      AudioAnalyser.play(audioContext.ctx, audioContext.analyser, audio, 0);

      const loop = () => {
        controls.update();
        const time = clock.getElapsedTime();
        // AudioAnalyser.getData(audioContext.analyser, buffer);
        // const bpm = bpmDetector.update(time);
        // const bpmCounter = Math.floor((bpm / 60) * time);

        // const context = {
        //   buffer,
        //   time,
        // };
        // i0.update(context);
        // counter = bpmCounter;

        // if (time > 15 && time < 20) {
        //   AudioAnalyser.getData(audioContext.analyser, textureBuffer);
        //   dataTexture.needsUpdate = true;
        //   audioDistortionPass.uniforms.uAudioTexture.value = dataTexture;
        // }
        audioDistortionPass.uniforms.uTime.value = time;

        if (video.currentTime > 19.3 && video.currentTime <= 21) {
          audioDistortionPass.enabled = true;
          AudioAnalyser.getData(audioContext.analyser, textureBuffer);
          dataTexture.needsUpdate = true;
          audioDistortionPass.uniforms.uAudioTexture.value = dataTexture;
        } else {
          audioDistortionPass.enabled = false;
        }

        // renderer.render(scene, camera);
        composer.render();
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
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/*<video
        ref={videoRef}
        src="/audio/Hull.mp4"
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />*/}

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />
    </div>
  );
}
