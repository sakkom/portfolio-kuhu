// "use client";

// import { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/Addons.js";
// // import { testSketch0, testSketch1 } from "./sketch/test";
// import { BpmDetector } from "@/app/bpm/two/bpmDetector";
// import { AudioAnalyser } from "@/app/audio/util";
// import { vol1S0 } from "./sketch";
// import { testSketch0 } from "@/app/vj/vol1/sketch/test";

// export function setThree(canvas: HTMLCanvasElement) {
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(
//     45,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     100,
//   );
//   const renderer = new THREE.WebGLRenderer({
//     canvas,
//     antialias: true,
//     alpha: true,
//   });
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   scene.background = null;
//   return { scene, camera, renderer };
// }

// export default function Page() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     /*basic status */
//     if (!canvasRef.current) return;
//     const { scene, camera, renderer } = setThree(canvasRef.current);
//     camera.position.z = 1;
//     const light = new THREE.DirectionalLight(0xffffff, 10);
//     light.position.set(0, 1, 0);
//     scene.add(light);
//     const controls = new OrbitControls(camera, canvasRef.current);
//     /* */

//     /*bpm & audioset */
//     const bpmDetector = BpmDetector.createBpm();
//     const audioContext = bpmDetector.init();
//     const buffer = new Float32Array(2048);
//     const i0 = vol1S0.idea0Sketch(scene);
//     i0.setup();

//     const clock = new THREE.Clock();
//     // const { ctx, analyser, buffer } = AudioAnalyser.init(2048);

//     let counter = 0;
//     const handleClick = async () => {
//       const audio = new Audio("/audio/audio_clean.wav");
//       AudioAnalyser.play(audioContext.ctx, audioContext.analyser, audio, 76);

//       const loop = () => {
//         controls.update();
//         const time = clock.getElapsedTime();
//         AudioAnalyser.getData(audioContext.analyser, buffer);
//         const bpm = bpmDetector.update(time);
//         const bpmCounter = Math.floor((bpm / 60) * time);
//         console.log("time:", time, "bpm:", bpm, "bpmCounter:", bpmCounter);

//         const context = {
//           buffer,
//           time,
//         };
//         // if (counter !== bpmCounter) {
//         i0.update(context);
//         console.log(bpmCounter);
//         counter = bpmCounter;
//         // }
//         // light.position.set(Math.cos(time), 1, Math.sin(time));

//         const rms = AudioAnalyser.getRms(audioContext.analyser.fftSize, buffer);
//         // if (counter % 10 == 0) {
//         //   camera.position.z = rms * 50;
//         // }
//         renderer.render(scene, camera);
//         requestAnimationFrame(loop);
//         // counter++;
//       };
//       loop();
//     };

//     window.addEventListener("click", handleClick, { once: true });
//   }, []);

//   return <canvas ref={canvasRef} />;
// }

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { BpmDetector } from "@/app/data/bpm/two/bpmDetector";
import { AudioAnalyser } from "@/app/audio/util";
import { kyuS0 } from "./sketch";

export function setThree(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { scene, camera, renderer } = setThree(canvasRef.current);
    camera.position.z = 1;
    const light = new THREE.DirectionalLight(0xffffff, 10);
    light.position.set(0, 1, 0);
    scene.add(light);
    const controls = new OrbitControls(camera, canvasRef.current);

    const bpmDetector = BpmDetector.createBpm();
    const audioContext = bpmDetector.init();
    const buffer = new Float32Array(2048);
    const i0 = kyuS0.sketchKyu0(scene);
    i0.setup();

    const stream = canvasRef.current.captureStream(60);
    const recoder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9",
      videoBitsPerSecond: 8000000,
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
      a.download = "kyu_sketch0.webm";
      a.click();
      URL.revokeObjectURL(url);
    };

    const clock = new THREE.Clock();
    let counter = 0;

    const handleClick = async () => {
      recoder.start();
      setTimeout(() => {
        recoder.stop();
      }, 10000);

      if (videoRef.current) {
        videoRef.current.currentTime = 76;
        videoRef.current.play();
      }

      const audio = new Audio("/audio/audio_clean.wav");
      AudioAnalyser.play(audioContext.ctx, audioContext.analyser, audio, 76);

      const loop = () => {
        controls.update();
        const time = clock.getElapsedTime();
        AudioAnalyser.getData(audioContext.analyser, buffer);
        const bpm = bpmDetector.update(time);
        const bpmCounter = Math.floor((bpm / 60) * time);

        const context = {
          buffer,
          time,
        };
        i0.update(context);
        counter = bpmCounter;

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
        position: "relative",
        width: "100vw",
        height: "100vh",
      }}
    >
      <video
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
      />

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
