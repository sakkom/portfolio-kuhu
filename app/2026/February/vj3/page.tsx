"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { vj3Morph } from "./morph";
import { AudioAnalyser } from "@/app/glsl-school/week3/page";
import { BpmDetector } from "@/app/data/bpm/two/bpmDetector";
import { vj3Morph2 } from "./morph2";
import { vj3TwoDAudio } from "./twoDAudio";
import { vj3Metaball } from "./metaball";
import { vj3Osi } from "./osi";
import { vj3AudioBlock } from "./audioBlock";
import { vj3Kido } from "./kido";
import { vj3Sketch0313 } from "./sketch0313";
import { vj3Sketch0319 } from "./sketch0319";
import { vj3Sketch0321 } from "./sketch0321";

export interface Vj3Props {
  bpm: number;
  time: number;
  analyser: AnalyserNode;
  onBeat: boolean;
}

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

  useEffect(() => {
    if (!canvasRef.current) return;
    const { scene, camera, renderer } = setThree(canvasRef.current);
    // renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene.background = new THREE.Color(0x000000);
    camera.position.z = 1;

    const morph = vj3Morph(scene);
    const morph2 = vj3Morph2(scene);
    const towD = vj3TwoDAudio(scene);
    const metaball = vj3Metaball(scene);
    const osi = vj3Osi(scene);
    const audioBlock = vj3AudioBlock(scene);
    // const kido = vj3Kido(scene);
    // const skecth0313 = vj3Sketch0313(scene);
    const sketch0319 = vj3Sketch0319(scene);
    const sketch0321 = vj3Sketch0321(scene);
    // morph.init();
    // morph2.init();
    // towD.init();
    // metaball.init();
    // osi.init();
    // audioBlock.init();
    // kido.init();
    // skecth0313.init();
    // sketch0319.init();
    sketch0321.init();

    const bpmDetector = BpmDetector.createBpm();
    const audioContext = bpmDetector.init();

    const clock = new THREE.Clock();
    let bpmCounter = 0;
    const loop = () => {
      const time = clock.getElapsedTime();
      const bpm = bpmDetector.update(time);
      const bpmCount = Math.floor(((bpm * 1) / 60) * time);
      const onBeat = bpmCounter != bpmCount;
      bpmCounter = bpmCount;
      bpmCounter = bpmCount;
      const props = {
        bpm,
        time,
        analyser: audioContext.analyser,
        onBeat,
      };
      // morph.update(props);
      // morph2.update(props);
      // towD.update(props);
      // metaball.update(props);
      // osi.update(props);
      // audioBlock.update(props);
      // kido.update(props);
      // skecth0313.update(props);
      // sketch0319.update(props);
      sketch0321.update(props);

      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    // loop();

    const handleClick = async () => {
      // const devices = await navigator.mediaDevices.enumerateDevices();
      // const audioinputs = devices.filter((d) => d.kind == "audioinput");
      // console.log(audioinputs);
      // const ipod = audioinputs.find((d) => d.label.includes("USB Audio"));
      // const stream = await navigator.mediaDevices.getUserMedia({
      //   audio: {
      //     deviceId: { exact: ipod?.deviceId },
      //     echoCancellation: false,
      //     noiseSuppression: false,
      //     autoGainControl: true,
      //   },
      // });
      // console.log(stream);
      const audio = new Audio("/vj3/A面B面.wav");
      audio.onloadedmetadata = () => {
        AudioAnalyser.play(
          audioContext.ctx,
          audioContext.analyser,
          audio,
          Math.floor(Math.random() * 2000),
        );
        loop();
      };
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
