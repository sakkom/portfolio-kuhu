"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { scene0Shader } from "./scene0/scene0";
import { AudioAnalyser } from "@/app/audio/util";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
} from "three/examples/jsm/Addons.js";
import { scene1Shader } from "./scene1";
import { speedAxisShader } from "./scene0/speedAxis";
import { scene2Shader } from "./scene2/scene2";
import { glitchShader } from "./scene2/glitch";
import { rippleShader } from "./scene2/ripple";
import { fisheye0109 } from "./scene2/fisheye";
import { scene3Shader } from "./scene3/scene3";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smoothRms = useRef<number>(0);
  const rmsRef = useRef<number>(0);
  const zcrRef = useRef<number>(0);
  const rmsTimeRef = useRef<number>(0);
  const midi0Ref = useRef<Map<number, number>>(new Map());
  const midi1Ref = useRef<Map<number, number>>(new Map());
  const midi2Ref = useRef<Map<number, number>>(new Map());
  const sceneNum = useRef<number>(0);
  const colorRef = useRef<Map<number, number>>(new Map());
  const effectorRef = useRef<Map<number, number>>(new Map());
  const stopMotion = useRef<boolean>(false);
  const lastPad = useRef<number>(null);
  const rmsTimeConfig = useRef<Map<number, number>>(new Map());
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;

    const { ctx, analyser, buffer } = AudioAnalyser.init(2048);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });

    let material = new THREE.ShaderMaterial(scene0Shader);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const speedAxis = new ShaderPass(speedAxisShader);
    speedAxis.enabled = false;
    composer.addPass(speedAxis);

    const ripple = new ShaderPass(rippleShader);
    ripple.enabled = false;
    composer.addPass(ripple);

    const glitch = new ShaderPass(glitchShader);
    glitch.enabled = false;
    composer.addPass(glitch);

    const fisheye = new ShaderPass(fisheye0109);
    fisheye.enabled = false;
    composer.addPass(fisheye);

    const dataTexture = new THREE.DataTexture(
      buffer,
      analyser.fftSize,
      1,
      THREE.RedFormat,
      THREE.FloatType,
    );
    dataTexture.needsUpdate = true;

    navigator.requestMIDIAccess().then((access) => {
      const inputs = access.inputs;
      inputs.forEach((input) => {
        input.onmidimessage = (m) => {
          if (!m.data) return;
          let [status, ctrl, value] = m.data;
          console.log(status);
          if (status == 176) {
            if (ctrl == 16) {
              colorRef.current.set(ctrl, value / 127);
            }
            if (ctrl == 17) {
              colorRef.current.set(ctrl, value / 127);
            }
            //rmsTime
            if (ctrl == 22) {
              rmsTimeConfig.current.set(ctrl, (value / 127) * 0.5);
            }
            if (ctrl == 23) {
              rmsTimeConfig.current.set(ctrl, (value / 127) * 3.0);
            }
          }
          if (status == 176 && sceneNum.current == 0) {
            if (ctrl == 3) {
              const nValue = (value / 127) * 2.0;
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
          }
          if (status == 176 && sceneNum.current == 1) {
            if (ctrl == 3) {
              const nValue = Math.max((value / 127) * 100.0, 2.0);
              midi1Ref.current.set(ctrl, nValue);
            }
            if (ctrl == 9) {
              const nValue = (value / 127) * 1;
              midi1Ref.current.set(ctrl, nValue);
            }
            if (ctrl == 12) {
              const nValue = (value / 127) * 0.1;
              midi1Ref.current.set(ctrl, nValue);
            }
            if (ctrl == 13) {
              const nValue = (value / 127) * 10.0;
              midi1Ref.current.set(ctrl, nValue);
            }
          }
          if (status == 176 && sceneNum.current == 2) {
            if (ctrl == 3) {
              const nValue = Math.max((value / 127) * 100.0, 1.0);
              midi1Ref.current.set(ctrl, nValue);
            }
          }

          if (status == 176 && sceneNum.current == 2) {
            if (ctrl == 9) {
              const nValue = value / 127;
              midi2Ref.current.set(ctrl, nValue);
            }
          }

          //snece切り替え
          if (status == 153) {
            lastPad.current = ctrl;
            if (ctrl == 36) {
              sceneNum.current = 0;
              material.dispose();
              material = new THREE.ShaderMaterial(scene0Shader);
              mesh.material = material;
            }
            if (ctrl == 37) {
              sceneNum.current = 1;
              material.dispose();
              material = new THREE.ShaderMaterial(scene1Shader);
              mesh.material = material;
            }
            if (ctrl == 38) {
              sceneNum.current = 2;
              material.dispose();
              material = new THREE.ShaderMaterial(scene2Shader);
              mesh.material = material;
            }
            if (ctrl == 39) {
              sceneNum.current = 3;
              material.dispose();
              material = new THREE.ShaderMaterial(scene3Shader);
              mesh.material = material;
            }
            //effector
            if (ctrl == 48) {
              stopMotion.current = true;
            }
            // if (sceneNum.current == 0) {
            if (ctrl == 49) {
              speedAxis.enabled = true;
            }
            if (ctrl == 50) {
              glitch.enabled = true;
            }
            if (ctrl == 51) {
              ripple.enabled = true;
            }
            if (ctrl == 44) {
              fisheye.enabled = true;
            }
            // }
          }
          if (status == 137) {
            if (ctrl == 48) {
              stopMotion.current = false;
            }
            // if (sceneNum.current == 0) {
            if (ctrl == 49) {
              speedAxis.enabled = false;
            }
            if (ctrl == 50) {
              glitch.enabled = false;
            }
            if (ctrl == 51) {
              ripple.enabled = false;
            }
            if (ctrl == 44) {
              fisheye.enabled = false;
            }
            // }
          }
          //velocity
          // console.log(m.data);
          // if (status == 217) {
          //   value = ctrl;
          //   if (lastPad.current == 49) {
          //     effectorRef.current.set(lastPad.current, (value / 127) * 10.0);
          //   }
          // }
          if (status == 153 && ctrl == 40) {
            const osc = ctx.createOscillator();
            osc.frequency.value = Math.random() * 300.0;
            // osc.start();
            oscRef.current = osc;
            AudioAnalyser.play(ctx, analyser, osc);
          }
          if (status == 137 && ctrl == 40 && oscRef.current) {
            // oscRef.current.stop();
            // oscRef.current.disconnect();
            oscRef.current = null;
          }
        };
      });
    });

    const handleClick = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioinputs = devices.filter((d) => d.kind == "audioinput");
      console.log("audio input list", audioinputs);
      const ipod = audioinputs.find((d) => d.label.includes("USB Audio"));
      const blackhole = audioinputs.find((d) => d.label.includes("BlackHole"));
      console.log(blackhole);
      // const stream = await navigator.mediaDevices.getUserMedia({
      //   audio: {
      //     deviceId: { exact: ipod?.deviceId },
      //     echoCancellation: false,
      //     noiseSuppression: false,
      //     autoGainControl: true,
      //     sampleRate: 44100,
      //   },
      // });
      // const stream = await navigator.mediaDevices.getDisplayMedia({
      //   audio: true,
      //   video: true,
      // });
      // const audio = new Audio("/audio/audio-01.mp3");
      const audio = new Audio(
        "/audio/sample-pack-link-in-bio-dopetronic-aliens-in-my-basement-331356.mp3",
      );
      // const osc = ctx.createOscillator();
      // osc.frequency.value = 0;
      // oscRef.current = osc;
      // AudioAnalyser.play(ctx, analyser, oscRef.current);

      const clock = new THREE.Clock();
      let index = 0.0;
      const loop = () => {
        AudioAnalyser.getData(analyser, buffer);

        const rms = AudioAnalyser.getRms(analyser.fftSize, buffer);
        rmsRef.current = rms;
        console.log(rms);
        smoothRms.current = smoothRms.current * 0.9 + rms * 0.1;
        const zcr = AudioAnalyser.getZcr(analyser.fftSize, buffer);
        zcrRef.current = zcr;
        const rmsThreshold = rmsTimeConfig.current.get(22) ?? 0.01;
        const rmsTimeStep = rmsTimeConfig.current.get(23) ?? 0.1;
        const rmsTime = AudioAnalyser.getRmsTime(
          rms,
          rmsThreshold,
          rmsTimeStep,
        );
        rmsTimeRef.current += rmsTime;

        const saturation = colorRef.current.get(16) ?? 0.5;
        const lightness = colorRef.current.get(17) ?? 1.0;

        const distore = effectorRef.current.get(49) ?? 1.0;

        const time = clock.getElapsedTime();
        speedAxis.uniforms.uTime.value = time;
        speedAxis.uniforms.uRmsTime.value = rmsTimeRef.current;
        speedAxis.uniforms.uRms.value = rms;
        speedAxis.uniforms.uResolution.value = new THREE.Vector2(
          canvasRef.current?.width,
          canvasRef.current?.height,
        );

        glitch.uniforms.uRmsTime.value = rmsTimeRef.current;
        glitch.uniforms.uRms.value = smoothRms.current;
        ripple.uniforms.uRmsTime.value = rmsTimeRef.current;
        ripple.uniforms.uRms.value = smoothRms.current;
        fisheye.uniforms.uRmsTime.value = rmsTimeRef.current;
        fisheye.uniforms.uRms.value = smoothRms.current;

        if (sceneNum.current == 0 && !stopMotion.current) {
          // MIDI params
          const rmsAmp = midi0Ref.current.get(3) ?? 1.0;
          const noiseScale = midi0Ref.current.get(9) ?? 0.01;
          const width = midi0Ref.current.get(12) ?? 0.25;
          const dirSpeed = midi0Ref.current.get(13) ?? 10.0;
          const height = midi0Ref.current.get(14) ?? 0.1;
          const colDist = midi0Ref.current.get(15) ?? 1.0;
          //effector uniforms

          material.uniforms.uRms.value = rms * 5.0;
          material.uniforms.uZcr.value = zcr;
          material.uniforms.uRmsTime.value = rmsTimeRef.current;

          material.uniforms.uRmsAmp.value = rmsAmp;
          material.uniforms.uNoiseScale.value = noiseScale;
          material.uniforms.uWidth.value = width;
          material.uniforms.uDirSpeed.value = dirSpeed;
          material.uniforms.uHeight.value = height;
          material.uniforms.uColDist.value = colDist;
          material.uniforms.uSaturation.value = saturation;
          material.uniforms.uLightness.value = lightness;

          // speedAxis.uniforms.uDistore.value = distore;
        }

        // scene 2: sketch0110
        if (sceneNum.current == 1 && !stopMotion.current) {
          const loopNum = midi1Ref.current.get(3) ?? 50.0;
          const colorMix = midi1Ref.current.get(9) ?? 1.0;
          const line = midi1Ref.current.get(12) ?? 0.01;
          const heightAmp = midi1Ref.current.get(13) ?? 1.0;

          material.uniforms.uRms.value = smoothRms.current;
          material.uniforms.uZcr.value = zcr;
          material.uniforms.uRmsTime.value = rmsTimeRef.current;
          material.uniforms.uTime.value = clock.getElapsedTime();
          material.uniforms.uLoopNum.value = loopNum;
          material.uniforms.uColorMix.value = colorMix;
          material.uniforms.uSaturation.value = saturation;
          material.uniforms.uLightness.value = lightness;
          material.uniforms.uLine.value = line;
          material.uniforms.uHeightAmp.value = heightAmp;

          if (index % 3.0 == 0.0) {
            dataTexture.needsUpdate = true;
          }
          material.uniforms.uTex.value = dataTexture;

          // speedAxis.uniforms.uDistore.value = distore;
        }

        if (sceneNum.current == 2 && !stopMotion.current) {
          const loopNum = midi1Ref.current.get(3) ?? 3.0;
          const circleSize = midi2Ref.current.get(9) ?? 0.1;
          material.uniforms.uRms.value = smoothRms.current;
          material.uniforms.uZcr.value = zcrRef.current;
          material.uniforms.uRmsTime.value = rmsTimeRef.current;
          material.uniforms.uTime.value = clock.getElapsedTime();
          material.uniforms.uResolution.value = new THREE.Vector2(
            canvasRef.current?.width,
            canvasRef.current?.height,
          );
          material.uniforms.uSaturation.value = saturation;
          material.uniforms.uLightness.value = lightness;
          material.uniforms.uCircleSize.value = circleSize;
          //NOBU
          material.uniforms.uLoopNum.value = loopNum;
        }

        if (sceneNum.current == 3 && !stopMotion.current) {
          material.uniforms.uRmsTime.value = rmsTimeRef.current;
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
