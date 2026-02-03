"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sketch0110Shader } from "./shader";
import { count } from "node:console";
import { time } from "three/src/nodes/TSL.js";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import { AudioAnalyser } from "@/app/audio/util";

const TARGETHZ: [number, number] = [0, 22050];

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothRms = useRef<number>(0);
  const rmsTime = useRef<number>(0);
  const zcr = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    // canvasRef.current.width = innerHeight - 50;
    // canvasRef.current.height = innerHeight - 50;

    canvasRef.current.width = innerWidth;
    canvasRef.current.height = innerHeight;

    const { ctx, analyser, buffer } = AudioAnalyser.init(2048);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    const material = new THREE.ShaderMaterial(sketch0110Shader);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // const composer = new EffectComposer(renderer);
    // composer.addPass(new RenderPass(scene, camera));
    // const ripple = new ShaderPass(rippleShader);
    // const glitch = new ShaderPass(glitch0109);
    // const fisheye = new ShaderPass(fisheye0109);
    // composer.addPass(fisheye);
    // composer.addPass(ripple);
    // composer.addPass(glitch);

    const dataTexture = new THREE.DataTexture(
      buffer,
      analyser.fftSize,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );
    dataTexture.needsUpdate = true;

    const handleClick = async () => {
      // const audio = new Audio(
      //   "/audio/sample-pack-link-in-bio-dopetronic-aliens-in-my-basement-331356.mp3",
      // );
      // const audio = new Audio("/audio/audio-03.mp3");

      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioinputs = devices.filter((d) => d.kind == "audioinput");
      const ipod = audioinputs.find((d) => d.label.includes("USB Audio"));
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: ipod?.deviceId },
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });

      // console.log(ipod);
      console.log(stream.getAudioTracks());
      AudioAnalyser.play(ctx, analyser, stream);

      const clock = new THREE.Clock();
      let index = 0.0;
      const loop = () => {
        AudioAnalyser.getData(analyser, buffer);

        const rms = AudioAnalyser.getRms(analyser.fftSize, buffer);
        console.log(rms);
        smoothRms.current = smoothRms.current * 0.98 + rms * 0.02;

        rmsTime.current += AudioAnalyser.getRmsTime(rms, 0.05, 1.0);

        zcr.current = AudioAnalyser.getZcr(analyser.fftSize, buffer);

        // material.uniforms.uRms.value = rms;
        material.uniforms.uRms.value = smoothRms.current;
        material.uniforms.uZcr.value = zcr.current;
        material.uniforms.uRms.value = rmsTime.current;
        material.uniforms.uTime.value = clock.getElapsedTime();

        if (index % 4.0 == 0.0) {
          dataTexture.needsUpdate = true;
        }
        // if (rms > 0.5) {
        material.uniforms.uTex.value = dataTexture;
        // }
        renderer.render(scene, camera);
        requestAnimationFrame(loop);
        index++;
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
        style={
          {
            // border: "1px solid white",
          }
        }
      />
    </div>
  );
}
