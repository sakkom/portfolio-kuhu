"use client";

import { useEffect, useRef, useState } from "react";
import { AudioAnalyser } from "@/app/audio/util";
import * as THREE from "three";
import { bpmShader } from "./bpmFlush";

interface Onset {
  timestamp: number;
  fluxValue: number;
  bin: number;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bpm, setBpm] = useState<number>(0);
  const bpmRef = useRef<number>(0);
  const onsets = useRef<Onset[]>([]);
  const lastOnsetTime = useRef<number>(0);

  // 改善1: flux履歴で適応的閾値
  const fluxHistory = useRef<number[]>([]);

  const prevLow = useRef<number>(0);
  const prevMid = useRef<number>(0);
  const prevHigh = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const { ctx, analyser, buffer } = AudioAnalyser.initSpectrum(1024);

    // const audio = new Audio("/audio/120bpm/jazz-drums-solo-120-bpm-204483.mp3");
    // const { ctx, analyser, buffer } = AudioAnalyser.initSpectrum(1024);
    //     // const audio = new Audio("/audio/audio-05.mp3"); // 93BPM
    // const audio = new Audio("/audio/o_o_out_on_Wisdom_Teeth.mp3"); //135 不安定
    // const audio = new Audio("/audio/OvO - Jeremy Black.mp3"); //133 簡単
    const audio = new Audio(
      "/audio/120bpm/dance-maverik-peace-125-bpm-325040.mp3",
    ); // 125BPM

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(512 * 1.5, 512 * 1.5);

    const material = new THREE.ShaderMaterial(bpmShader);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const handleClick = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioinputs = devices.filter((d) => d.kind == "audioinput");
      console.log("audio input list", audioinputs);
      const ipod = audioinputs.find((d) => d.label.includes("USB Audio"));
      const blackhole = audioinputs.find((d) => d.label.includes("BlackHole"));
      console.log(blackhole);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: ipod?.deviceId },
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });

      AudioAnalyser.play(ctx, analyser, stream);
      const startTime = ctx.currentTime;
      let frameCounter = 0;

      const loop = () => {
        AudioAnalyser.getSpectrumData(analyser, buffer);

        const lowAver = getAver(
          buffer,
          [30, 100],
          ctx.sampleRate,
          analyser.fftSize,
        );
        const midAver = getAver(
          buffer,
          [100, 300],
          ctx.sampleRate,
          analyser.fftSize,
        );
        const highAver = getAver(
          buffer,
          [2000, 5000],
          ctx.sampleRate,
          analyser.fftSize,
        );

        const lowFlux = Math.abs(lowAver - prevLow.current);
        const midFlux = Math.abs(midAver - prevMid.current);
        const highFlux = Math.abs(highAver - prevHigh.current);

        prevLow.current = lowAver;
        prevMid.current = midAver;
        prevHigh.current = highAver;

        const maxFlux = Math.max(lowFlux, midFlux, highFlux);

        // 改善1: 適応的閾値（平均の1.5倍）
        fluxHistory.current.push(maxFlux);
        if (fluxHistory.current.length > 300) fluxHistory.current.shift();

        const now = ctx.currentTime - startTime;

        if (fluxHistory.current.length >= 60) {
          const avgFlux =
            fluxHistory.current.reduce((a, b) => a + b, 0) /
            fluxHistory.current.length;
          const threshold = avgFlux * 1.5; // 元の固定値の代わり

          if (maxFlux > threshold && now - lastOnsetTime.current > 0.15) {
            const normalizedValue = Math.min(maxFlux / 50, 1.0);
            const bin = Math.floor(normalizedValue * 100);
            if (bin > 0) {
              onsets.current.push({
                timestamp: now,
                fluxValue: normalizedValue,
                bin,
              });
              lastOnsetTime.current = now;
              if (onsets.current.length > 128) onsets.current.shift();
            }
          }
        }

        // BPM計算（元のロジックそのまま）
        if (frameCounter % 60 === 0 && onsets.current.length >= 8) {
          const bpms = new Map<number, number>();

          for (let i = 0; i < onsets.current.length - 8; i++) {
            for (let j = 1; j <= 8; j++) {
              let space =
                (onsets.current[i + j].timestamp -
                  onsets.current[i].timestamp) /
                j;
              if (space < 0.2 || space > 1.0) continue;

              let bpm = 60 / space;
              while (bpm < 90) bpm *= 2;
              while (bpm > 180) bpm /= 2;
              bpm = Math.round(bpm);

              const weight = 1.0 / j;
              bpms.set(bpm, (bpms.get(bpm) || 0) + weight);
            }
          }

          // 改善2: クラスタ範囲を広げる（±5→±6）
          const clusters = new Map<number, number>();
          bpms.forEach((score, bpm) => {
            let totalScore = 0;
            for (let offset = -8; offset <= 8; offset++) {
              totalScore +=
                (bpms.get(bpm + offset) || 0) * (1 - Math.abs(offset) * 0.08);
            }
            clusters.set(bpm, totalScore);
          });

          let maxScore = 0;
          let detectedBPM = 0;
          clusters.forEach((score, bpm) => {
            if (score > maxScore) {
              maxScore = score;
              detectedBPM = bpm;
            }
          });

          bpmRef.current = detectedBPM;
          setBpm(detectedBPM);

          console.log(
            "Top 5:",
            Array.from(clusters.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5),
          );
        }

        material.uniforms.uBpm.value = bpmRef.current;
        material.uniforms.uTime.value = now;
        material.uniforms.uBeats.value = bpmRef.current
          ? (now / 60) * bpmRef.current
          : 0;

        renderer.render(scene, camera);
        requestAnimationFrame(loop);
        frameCounter++;
      };
      loop();
    };

    window.addEventListener("click", handleClick, { once: true });
  }, []);

  return (
    <div style={{ width: "100%", minHeight: "100vh", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 100,
          zIndex: 10,
          background: "rgba(0,0,0,0.7)",
          padding: 20,
          borderRadius: 8,
          color: "white",
        }}
      >
        <h1 style={{ margin: 0 }}>BPM: {bpm || "..."}</h1>
        <div style={{ fontSize: 12 }}>Onsets: {onsets.current.length}</div>
      </div>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}

function getAver(
  buffer: Uint8Array,
  targetHz: [number, number],
  sampleRate: number,
  fftSize: number,
) {
  const bin = sampleRate / fftSize;
  const start = Math.floor(targetHz[0] / bin);
  const end = Math.ceil(targetHz[1] / bin);
  let sum = 0;
  for (let i = start; i < end; i++) sum += buffer[i];
  return sum / (end - start);
}
