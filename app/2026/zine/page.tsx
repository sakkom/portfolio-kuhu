"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { zineSketch01 } from "./page1Sketch";

function setThree(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;
  // const aspect = 4 / 3;
  const aspect = WIDTH / HEIGHT;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  // renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setPixelRatio(1);
  // renderer.setSize(window.innerWidth, window.innerHeight);
  scene.background = null;
  return { scene, camera, renderer, aspect };
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { scene, camera, renderer, aspect } = setThree(canvasRef.current);
    // renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene.background = new THREE.Color(0x000000);
    camera.position.z = 1;
    const gl = renderer.getContext();
    console.log("max texture size:", gl.getParameter(gl.MAX_TEXTURE_SIZE));

    const sketch01 = zineSketch01(scene);
    sketch01.init(aspect).then((result) => {
      const { imageW, imageH } = result;
      renderer.setSize(imageW, imageH, false);
      const imageAspect = imageW / imageH;
      camera.left = -imageAspect;
      camera.right = imageAspect;
      camera.updateProjectionMatrix();
      console.log(
        "canvas size:",
        renderer.domElement.width,
        renderer.domElement.height,
      );
      /*canvas2 */
      const textCanvas = textCanvasRef.current;
      if (!textCanvas) return;
      textCanvas.width = imageW;
      textCanvas.height = imageH;
      const ctx = textCanvas.getContext("2d");

      const code = `
        void main() {
          vec2 uv = vUv;
          uv *= .9;
          uv.x -= .1;
          vec4 t = vec4(0.);
          t = texture2D(uTex, uv);
          float l = lumi(t.rgb);

          vec3 c = vec3(0.);

          vec2 bUv = uv;
          if(l < .65) {
           float s = floor(bUv.y * 20.);
           float b = rand1(s) * 20.;
           bUv.y = floor(bUv.y * b) / b;
           bUv.x -= rand1(bUv.y) * .35;
           vec4 t = vec4(0.);
           t = texture2D(uTex, bUv);
           float l = lumi(t.rgb);
           l = pow(l, 3.);
           l *= 1.5;
           if(uv.x > 0.5) {
             c = vec3(step(l, .01));
           } else {
             c = vec3(l);
           }
          } else {
           vec3 t = vec3(0.);
           t = texture2D(uTex, uv).rgb;
           t = pow(t, vec3(.5));
           c = t;
          }

          gl_FragColor = vec4(c, 1.);
        }
      `;

      const loop = () => {
        sketch01.update();
        renderer.render(scene, camera);

        ctx?.clearRect(0, 0, textCanvas.width, textCanvas.height);
        if (!ctx) return;
        ctx.fillStyle = "white";
        ctx.font = "100px Vera";
        ctx.letterSpacing = "-15px";
        let lineNum = 0;
        code.split("\n").forEach((line, i) => {
          lineNum++;
        });
        code.split("\n").forEach((line, i) => {
          ctx.fillText(line, 0, ((i + 1) * textCanvas.height) / lineNum);
        });

        requestAnimationFrame(loop);
      };
      loop();
    });

    // const handleKeyDown = (e: KeyboardEvent) => {
    //   if (e.key !== "s") return;
    //   // scene.background = new THREE.Color(0xff0000);
    //   scene.background = null;
    //   renderer.render(scene, camera);
    //   const link = document.createElement("a");
    //   link.download = `zine_${Date.now()}.png`;
    //   link.href = renderer.domElement.toDataURL("image/png");
    //   link.click();
    //   scene.background = new THREE.Color(0x000000);
    // };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "s") return;
      // scene.background = new THREE.Color(0xff0000);
      scene.background = null;
      const offScreen = document.createElement("canvas");
      offScreen.width = renderer.domElement.width;
      offScreen.height = renderer.domElement.height;
      const offCtx = offScreen.getContext("2d");
      if (!offCtx) return;
      offCtx.drawImage(renderer.domElement, 0, 0);
      if (textCanvasRef.current) {
        offCtx.drawImage(textCanvasRef.current, 0, 0);
      }

      renderer.render(scene, camera);
      const link = document.createElement("a");
      link.download = `zine_${Date.now()}.png`;
      link.href = offScreen.toDataURL("image/png");
      link.click();
      scene.background = new THREE.Color(0x000000);
    };

    window.addEventListener("keydown", handleKeyDown);
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
      <div
        style={{
          position: "relative",
          width: "45vw",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "auto",
            // display: "block",
            // scale: 0.5,
          }}
        />
        <canvas
          ref={textCanvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}
