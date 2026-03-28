// "use client";

// import { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { MishinSketch0 } from "./sketch";

// function setThree(canvas: HTMLCanvasElement) {
//   const scene = new THREE.Scene();
//   const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
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
//     if (!canvasRef.current) return;
//     const { scene, camera, renderer } = setThree(canvasRef.current);
//     // renderer.outputColorSpace = THREE.SRGBColorSpace;
//     scene.background = new THREE.Color(0xffffff);
//     camera.position.z = 1;

//     const mishinSketch0 = MishinSketch0(scene);
//     mishinSketch0.init();

//     const loop = () => {
//       renderer.render(scene, camera);
//       requestAnimationFrame(loop);
//     };
//     loop();
//   }, []);

//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "100vw",
//         height: "100vh",
//       }}
//     >
//       <canvas
//         ref={canvasRef}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           zIndex: 1,
//         }}
//       />
//     </div>
//   );
// }
"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MishinSketch0 } from "./sketch";

function setThree(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.background = null;
  return { scene, camera, renderer };
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sketchRef = useRef<ReturnType<typeof MishinSketch0> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { scene, camera, renderer } = setThree(canvasRef.current);
    scene.background = new THREE.Color(0xffffff);
    camera.position.z = 1;
    const mishinSketch0 = MishinSketch0(scene);
    mishinSketch0.init();
    sketchRef.current = mishinSketch0;
    const loop = () => {
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    };
    loop();
  }, []);

  // const savePNG = () => {
  //   if (!canvasRef.current) return;
  //   const a = document.createElement("a");
  //   a.href = canvasRef.current.toDataURL("image/png");
  //   a.download = "mishin.png";
  //   a.click();
  // };
  // const saveSVG = () => {
  //   if (!sketchRef.current) return;

  //   const W_mm = 100;
  //   const H_mm = 100;
  //   const aspect = 4 / 3; // sketchと同じ値

  //   let paths = "";

  //   sketchRef.current.lines.forEach((mesh) => {
  //     const pos = mesh.geometry.attributes.position;
  //     if (!pos) return;

  //     const worldPos = new THREE.Vector3();
  //     let d = "";

  //     for (let i = 0; i < pos.count; i++) {
  //       worldPos.set(pos.getX(i), pos.getY(i), pos.getZ(i));
  //       worldPos.applyMatrix4(mesh.matrixWorld);

  //       // アスペクト比補正を考慮してmmに変換
  //       // カメラは -1〜1 の正方形空間だが、xはaspectで縮めてある
  //       const x = ((worldPos.x * aspect + 1) / 2) * W_mm;
  //       const y = ((1 - worldPos.y) / 2) * H_mm;
  //       d +=
  //         i === 0
  //           ? `M ${x.toFixed(2)} ${y.toFixed(2)}`
  //           : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  //     }

  //     paths += `<path d="${d}" stroke="black" stroke-width="0.3" fill="none"/>\n`;
  //   });

  //   // アスペクト比に合わせてSVGサイズを調整
  //   const svg_w = W_mm * aspect; // 133mm
  //   const svg_h = H_mm; // 100mm
  //   const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W_mm}mm" height="${H_mm}mm" viewBox="0 0 ${W_mm} ${H_mm}">\n${paths}</svg>`;

  //   const blob = new Blob([svg], { type: "image/svg+xml" });
  //   const a = document.createElement("a");
  //   a.href = URL.createObjectURL(blob);
  //   a.download = "mishin.svg";
  //   a.click();
  // };

  const saveSVG = () => {
    if (!sketchRef.current) return;

    const SKETCH_ASPECT = 4 / 3; // sketchと同じ固定値
    const CANVAS_MM = 100;
    const PATTERN_W = CANVAS_MM;
    const PATTERN_H = PATTERN_W / SKETCH_ASPECT; // 75mm
    const OFFSET_Y = (CANVAS_MM - PATTERN_H) / 2; // 12.5mm上下余白

    let paths = "";

    sketchRef.current.lines.forEach((mesh) => {
      const pos = mesh.geometry.attributes.position;
      if (!pos) return;

      const worldPos = new THREE.Vector3();
      let d = "";

      for (let i = 0; i < pos.count; i++) {
        worldPos.set(pos.getX(i), pos.getY(i), pos.getZ(i));
        worldPos.applyMatrix4(mesh.matrixWorld); // scale(1.5)も反映される

        const x = ((worldPos.x * SKETCH_ASPECT + 1) / 2) * PATTERN_W;
        const y = ((1 - worldPos.y) / 2) * PATTERN_H + OFFSET_Y;
        d +=
          i === 0
            ? `M ${x.toFixed(2)} ${y.toFixed(2)}`
            : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
      }

      paths += `<path d="${d}" stroke="black" stroke-width="0.3" fill="none"/>\n`;
    });

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_MM}mm" height="${CANVAS_MM}mm" viewBox="0 0 ${CANVAS_MM} ${CANVAS_MM}">\n${paths}</svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mishin.svg";
    a.click();
  };
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
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
      <button
        onClick={saveSVG}
        style={{
          position: "absolute",
          bottom: 60,
          left: 20,
          zIndex: 2,
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        Save SVG
      </button>
    </div>
  );
}
