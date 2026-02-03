"use client";

import { AudioAnalyser } from "@/app/audio/util";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

function sketch() {}
export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const { ctx, analyser, buffer } = AudioAnalyser.init(1024);

    if (!canvasRef.current) return;
    const clock = new THREE.Clock();
    const aspect = window.innerWidth / window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    camera.position.z = 10;
    const light = new THREE.DirectionalLight(0xffffff, 10);
    light.position.set(0, 10, 0);
    scene.add(light);
    const controls = new OrbitControls(camera, canvasRef.current);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const meshs: THREE.Mesh[] = [];
    const loopNum = 100;
    for (let j = 0; j < loopNum; j++) {
      // let points: THREE.Vector3[] = [];
      const nagasa = 5;
      // const hen = Math.max(Math.random() * nagasa - nagasa / 2.0, 0);
      // const hen = (j / loopNum) * 5.0;
      const hen = nagasa;
      const height = Math.sin((60 * Math.PI) / 180) * hen;
      const p1 = new THREE.Vector3(hen / 2, -height / 3, 0);
      const p2 = new THREE.Vector3(-hen / 2, -height / 3, 0);
      const p3 = new THREE.Vector3(0, (height * 2) / 3, 0);
      const path = new THREE.CurvePath<THREE.Vector3>();
      path.add(new THREE.LineCurve3(p1, p2));
      path.add(new THREE.LineCurve3(p2, p3));
      path.add(new THREE.LineCurve3(p3, p1));
      const geometry = new THREE.TubeGeometry(path, 100, 0.01, 10);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.0, 0.0, 1.0),
        wireframe: false,
        metalness: 0.5,
        roughness: 0.5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        -1.0,
        Math.sin((j / loopNum + clock.getElapsedTime()) * 6.28) * 3.0,
        // 0.0,
        j * 0.05 - (loopNum * 0.05) / 2.0,
      );
      mesh.rotateZ(-0.05 * j);
      meshs.push(mesh);
    }
    meshs.forEach((m) => scene.add(m));

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
          sampleRate: 44100,
        },
      });
      // const stream = await navigator.mediaDevices.getUserMedia({
      //   audio: true,
      // });
      const audio = new Audio(
        "/audio/120bpm/94-bpm-standard-drum-loop-460076.mp3",
      );

      AudioAnalyser.play(ctx, analyser, audio);

      let counter = 0;
      let prevCounter = -1;
      let stopBuffer: number[] = new Array(loopNum).fill(0);
      let rot = 0.0;
      let sceneRot = 0.0;
      const loop = () => {
        AudioAnalyser.getData(analyser, buffer);

        counter = Math.floor(clock.getElapsedTime() / (60 / 94));
        // scene.rotateX(0.01);
        console.log(counter);
        if (counter != prevCounter) {
          stopBuffer = Array.from(buffer);
          prevCounter = counter;
          rot = Math.random() * 0.05;
          sceneRot = Math.random() * 6.28;
        }
        scene.rotation.set(sceneRot, sceneRot, sceneRot);
        meshs.forEach((m, i) => {
          m.position.set(
            // stopBuffer[i] * 10.0,
            buffer[i] * 1,
            Math.sin(stopBuffer[i + 10] * 6.28) * 5,
            i * 0.1 - (loopNum * 0.1) / 2.0,
          );

          m.rotation.z = rot * i;
        });
        controls.update();
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <canvas
        ref={canvasRef}
        width={512 * 1.2}
        height={512 * 1.2}
        // style={{ border: "1px solid white" }}
      />
    </div>
  );
}
