"use client";

import { vertexShader } from "@/app/glsl-school/week1/shader";
import { metaball2D } from "@/app/sketch/heart/shader";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { ballMove } from "@/app/sketch/ballMove/shader";
import { independentGlitch } from "@/app/sketch/pixelsorting/shader";
import { waveMix } from "@/app/sketch/spray/shader";

export default function bgMix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const cam = new THREE.PerspectiveCamera(
      45,
      canvas.width / canvas.height,
      0.1,
      100,
    );
    cam.position.set(0, 0, 2.0);

    const target1 = new THREE.WebGLRenderTarget(canvasWidth, canvasHeight);
    const target2 = new THREE.WebGLRenderTarget(canvasWidth, canvasHeight);

    const scene1 = new THREE.Scene();
    scene1.background = new THREE.Color(0x000000);
    const aspect = canvasWidth / canvasHeight;
    const geometry = new THREE.PlaneGeometry(2 * aspect, 2);
    const material1 = new THREE.ShaderMaterial(metaball2D);
    material1.uniforms.uResolution.value = new THREE.Vector2(
      canvasWidth,
      canvasHeight,
    );
    const mesh = new THREE.Mesh(geometry, material1);
    scene1.add(mesh);

    const scene2 = new THREE.Scene();
    scene2.background = new THREE.Color(0x00ff00);
    const geometry2 = new THREE.PlaneGeometry(2 * aspect, 2);
    const material2 = new THREE.ShaderMaterial(waveMix);
    material2.uniforms.uResolution.value = new THREE.Vector2(
      canvasWidth,
      canvasHeight,
    );
    const mesh2 = new THREE.Mesh(geometry2, material2);
    scene2.add(mesh2);

    const scene3 = new THREE.Scene();
    scene3.background = new THREE.Color(0x000000);
    const geometry3 = new THREE.PlaneGeometry(2 * aspect, 2);
    const material3 = new THREE.ShaderMaterial(ballMove);
    material3.uniforms.uResolution.value = new THREE.Vector2(
      canvasWidth,
      canvasHeight,
    );
    const mesh3 = new THREE.Mesh(geometry3, material3);
    scene3.add(mesh3);

    const scene4 = new THREE.Scene();
    scene4.background = new THREE.Color(0x00ff00);
    const geometry4 = new THREE.PlaneGeometry(2 * aspect, 2);
    const material4 = new THREE.ShaderMaterial(independentGlitch);
    material4.uniforms.uResolution.value = new THREE.Vector2(
      canvasWidth,
      canvasHeight,
    );
    const mesh4 = new THREE.Mesh(geometry4, material4);
    scene4.add(mesh4);

    const mixScene = new THREE.Scene();
    scene2.background = new THREE.Color(0x00ff00);
    const mixMaterial = new THREE.ShaderMaterial({
      uniforms: {
        //target1, target2をそれぞれexportする必要があるかも。
        uTex0: { value: target1.texture },
        uTex1: { value: target2.texture },
        uMixRatio: { value: 0.0 },
        uTime: { value: null },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform sampler2D uTex0;
        uniform sampler2D uTex1;
        uniform float uMixRatio;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          vec4 tex0 = texture2D(uTex0, uv);
          vec4 tex1 = texture2D(uTex1, uv);
          //transition感をpowで調整
          float col = tex1.r;
          vec4 mix = mix(tex0, tex1, pow(uMixRatio, .5));
          // vec4 mix = mix(tex0, tex1, length(uv - 0.5));
          gl_FragColor = mix;
        }
      `,
    });
    const mixMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2 * aspect, 2),
      mixMaterial,
    );
    mixScene.add(mixMesh);

    const scenes = [scene1, scene2, scene3, scene4];
    const materials = [material1, material2, material3, material4];

    let accum = 0.0;
    const maxWheel = 2000;
    let count = 0;
    const handleWheel = (e: WheelEvent) => {
      console.log(e.deltaY);
      e.preventDefault();
      accum += e.deltaY;

      if (accum >= maxWheel) {
        count++;
        if (count >= 3) {
          count = 0;
        }
        accum = 0.0;
      }
      if (accum < 0) {
        count--;
        if (count < 0) {
          count = 2;
        }
        accum = maxWheel;
      }

      //accumは1を超える。その後のシーンの追加コードが必要。
      accum = Math.max(0, accum);
      accum = Math.min(accum, maxWheel);
      const mixRatio = accum / maxWheel;

      // materials[count].uniforms.uShapeRatio.value = mixRatio;
      // materials[count + 1].uniforms.uShapeRatio.value = mixRatio;
      mixMaterial.uniforms.uMixRatio.value = mixRatio;
    };
    window.addEventListener("wheel", handleWheel, { passive: false });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.setRenderTarget(target1);
      renderer.render(scenes[count], cam);
      renderer.setRenderTarget(target2);
      renderer.render(scenes[count + 1], cam);
      renderer.setRenderTarget(null);
      renderer.render(mixScene, cam);
      materials.forEach((m) => {
        m.uniforms.uTime.value += 0.0167;
      });

      mixMaterial.uniforms.uTime.value += 0.0167;
    };
    animate();
  }, []);
  return <canvas ref={canvasRef} />;
}
