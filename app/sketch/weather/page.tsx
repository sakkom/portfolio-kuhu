"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { metaball2D } from "./shader";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(1152, 1248);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const cam = new THREE.PerspectiveCamera(
      45,
      canvasWidth / canvasHeight,
      0.1,
      100,
    );
    cam.position.set(0, 0, 1.0);

    const controls = new OrbitControls(cam, canvas);
    controls.rotateSpeed = 0.2;

    // ベジェ曲線用のジオメトリ（100頂点）
    const geometry = new THREE.PlaneGeometry(2, 2, 1000, 100);

    const material = new THREE.ShaderMaterial({
      uniforms: metaball2D.uniforms,
      vertexShader: metaball2D.vertexShader,
      fragmentShader: metaball2D.fragmentShader,
    });
    material.uniforms.uResolution.value.set(1152, 1248);

    const points = new THREE.Mesh(geometry, material);
    scene.add(points);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      material.uniforms.uTime.value += 0.033;
      controls.update();
      renderer.render(scene, cam);
    };

    animate();
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
      <canvas ref={canvasRef} />
    </div>
  );
}

// "use client";
// import { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { metaball2D } from "./shader";
// import { OrbitControls } from "three/examples/jsm/Addons.js";

// export default function Page() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const renderer = new THREE.WebGLRenderer({
//       canvas,
//       antialias: true,
//       preserveDrawingBuffer: true  // 高画質用
//     });
//     renderer.setSize(1152, 1248);
//     renderer.setPixelRatio(1);  // 高画質のため1に固定

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x000000);

//     const cam = new THREE.PerspectiveCamera(45, 1152 / 1248, 0.1, 100);
//     cam.position.set(0, 0, 1.0);

//     const controls = new OrbitControls(cam, canvas);
//     controls.rotateSpeed = 0.2;

//     const geometry = new THREE.PlaneGeometry(2, 2, 1000, 100);
//     const material = new THREE.ShaderMaterial({
//       uniforms: metaball2D.uniforms,
//       vertexShader: metaball2D.vertexShader,
//       fragmentShader: metaball2D.fragmentShader,
//     });
//     material.uniforms.uResolution.value.set(1152, 1248);

//     const points = new THREE.Mesh(geometry, material);
//     scene.add(points);

//     // 高画質MediaRecorder設定
//     const stream = canvas.captureStream(30);

//     // 27秒で300MB = 約89Mbps
//     const recorder = new MediaRecorder(stream, {
//       mimeType: 'video/webm;codecs=vp9',
//       videoBitsPerSecond: 80000000  // 80Mbps（高画質）
//     });

//     const chunks: Blob[] = [];

//     recorder.ondataavailable = (e) => {
//       if (e.data.size > 0) {
//         chunks.push(e.data);
//         console.log(`Chunk size: ${(e.data.size / 1024 / 1024).toFixed(2)}MB`);
//       }
//     };

//     recorder.onstop = () => {
//       const blob = new Blob(chunks, { type: 'video/webm' });
//       const sizeMB = (blob.size / 1024 / 1024).toFixed(2);
//       console.log(`Total size: ${sizeMB}MB`);

//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'let-sunday.webm';
//       a.click();
//       console.log('Recording saved!');
//     };

//     // 録画開始
//     recorder.start();
//     console.log('High quality recording started (80Mbps)');

//     // 27秒後に停止
//     setTimeout(() => {
//       recorder.stop();
//       console.log('Recording stopped');
//     }, 27000);

//     const animate = () => {
//       requestAnimationFrame(animate);
//       material.uniforms.uTime.value += 1 / 30;
//       controls.update();
//       renderer.render(scene, cam);
//     };

//     animate();
//   }, []);

//   return (
//     <div style={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       minHeight: "100vh",
//     }}>
//       <canvas ref={canvasRef} />
//     </div>
//   );
// }
