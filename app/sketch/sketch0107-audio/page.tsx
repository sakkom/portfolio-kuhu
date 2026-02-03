"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sketch0107Shader } from "./mainShader";
import { AudioAnalyser } from "@/app/audio/util";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import { distortion0110 } from "./distorion0110";
import { sketch0110Shader } from "../sketch0110-ipod/shader";
import { stat } from "node:fs/promises";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothRms = useRef<number>(0);
  const rmsRef = useRef<number>(0);
  const zcrRef = useRef<number>(0);
  const rmsTimeRef = useRef<number>(0);
  const midi0Ref = useRef<Map<number, number>>(new Map());
  const sceneNum = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;

    const { ctx, analyser, buffer } = AudioAnalyser.init(2048);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    let material = new THREE.ShaderMaterial(sketch0107Shader);
    navigator.requestMIDIAccess().then((access) => {
      const inputs = access.inputs;
      inputs.forEach((input) => {
        input.onmidimessage = (m) => {
          if (!m.data) return;
          const [status, ctrl, value] = m.data;
          console.log(status);
          if (status == 176) {
            if (ctrl == 3) {
              const nValue = (value / 127) * 10.0;
              midi0Ref.current.set(ctrl, nValue);
            }
            if (ctrl == 9) {
              midi0Ref.current.set(ctrl, Math.max((value / 127) * 0.5, 0.01));
            }
            if (ctrl == 12) {
              midi0Ref.current.set(ctrl, (value / 127) * 50);
            }
            if (ctrl == 13) {
              midi0Ref.current.set(ctrl, (value / 127) * 50);
            }
            if (ctrl == 14) {
              midi0Ref.current.set(ctrl, value / 127);
            }
            //B
            if (ctrl == 15) {
              midi0Ref.current.set(ctrl, value);
            }
            if (ctrl == 17) {
              midi0Ref.current.set(ctrl, value / 127);
            }
            if (ctrl == 18) {
              midi0Ref.current.set(ctrl, value / 127);
            }
          }
          if (status == 153) {
            if (ctrl == 36) {
              sceneNum.current = 0;
              material.dispose();
              material = new THREE.ShaderMaterial(sketch0107Shader);
              mesh.material = material;
            }
            if (ctrl == 37) {
              sceneNum.current = 1;
              material.dispose();
              material = new THREE.ShaderMaterial(sketch0110Shader);
              mesh.material = material;
            }
          }
        };
      });
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const distorion = new ShaderPass(distortion0110);
    composer.addPass(distorion);

    const dataTexture = new THREE.DataTexture(
      buffer,
      analyser.fftSize,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );
    dataTexture.needsUpdate = true;

    const handleClick = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioinputs = devices.filter((d) => d.kind == "audioinput");
      console.log("audio input list", audioinputs);
      const ipod = audioinputs.find((d) => d.label.includes("USB Audio"));
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: ipod?.deviceId },
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });
      AudioAnalyser.play(ctx, analyser, stream);

      const clock = new THREE.Clock();
      let index = 0.0;
      const loop = () => {
        AudioAnalyser.getData(analyser, buffer);

        const rms = AudioAnalyser.getRms(analyser.fftSize, buffer);
        rmsRef.current = rms;
        smoothRms.current = smoothRms.current * 0.9 + rms * 0.1;
        const zcr = AudioAnalyser.getZcr(analyser.fftSize, buffer);
        zcrRef.current = zcr;
        const rmsTime = AudioAnalyser.getRmsTime(rms, 0.01, 3.0);
        rmsTimeRef.current += rmsTime;

        // MIDI params
        const rmsAmp = midi0Ref.current.get(3) ?? 1.0;
        const noiseScale = midi0Ref.current.get(9) ?? 0.01;
        const width = midi0Ref.current.get(12) ?? 0.25;
        const dirSpeed = midi0Ref.current.get(13) ?? 10.0;
        const height = midi0Ref.current.get(14) ?? 0.1;
        const colDist = midi0Ref.current.get(15) ?? 1.0;
        const saturation = midi0Ref.current.get(17) ?? 0.5;
        const lightness = midi0Ref.current.get(18) ?? 1.0;

        if (sceneNum.current == 0) {
          material.uniforms.uRms.value = rms * 5.0;
          material.uniforms.uZcr.value = zcr;
          material.uniforms.uTime.value = clock.getElapsedTime();
          material.uniforms.uRmsTime.value = rmsTimeRef.current;

          material.uniforms.uRmsAmp.value = rmsAmp;
          material.uniforms.uNoiseScale.value = noiseScale;
          material.uniforms.uWidth.value = width;
          material.uniforms.uDirSpeed.value = dirSpeed;
          material.uniforms.uHeight.value = height;
          material.uniforms.uColDist.value = colDist;
          material.uniforms.uSaturation.value = saturation;
          material.uniforms.uLightness.value = lightness;

          distorion.uniforms.uRmsTime.value = rmsTimeRef.current;
          distorion.uniforms.uRms.value = rms;
          distorion.uniforms.uResolution.value = new THREE.Vector2(
            canvasRef.current?.width,
            canvasRef.current?.height,
          );
        }

        // scene 2: sketch0110
        if (sceneNum.current == 1) {
          material.uniforms.uRms.value = smoothRms.current;
          material.uniforms.uZcr.value = zcr;
          material.uniforms.uRmsTime.value = rmsTimeRef.current;
          material.uniforms.uTime.value = clock.getElapsedTime();

          if (index % 4.0 == 0.0) {
            dataTexture.needsUpdate = true;
          }
          material.uniforms.uTex.value = dataTexture;
        }

        composer.render();
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
      <canvas ref={canvasRef} />
    </div>
  );
}
