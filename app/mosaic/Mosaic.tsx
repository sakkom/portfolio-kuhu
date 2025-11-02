"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, ShaderPass } from "three/examples/jsm/Addons.js";
import { RenderPass } from "three/examples/jsm/Addons.js";
import { mosaicShader } from "./shader";
import "@/app/styles/article.css";
import { setGui } from "../utils/utils";
// import { FilmPass } from "three/examples/jsm/Addons.js";
// import { GlitchPass } from "three/examples/jsm/Addons.js";
// import { BloomPass } from "three/examples/jsm/Addons.js";
// import { DotScreenPass } from "three/examples/jsm/Addons.js";
// import { HalftonePass } from "three/examples/jsm/Addons.js";
// import { UnrealBloomPass } from "three/examples/jsm/Addons.js";
// import { OutlinePass } from "three/examples/jsm/Addons.js";

export default function Mosaic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const mosaicParams = useRef<{ pixelSize: number }>({ pixelSize: 5.0 });

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const clientWidth = canvas.clientWidth;
    const clientHeight = canvas.clientHeight;
    canvas.width = clientWidth;
    canvas.height = clientHeight;

    const gui = setGui();
    gui.add(mosaicParams.current, "pixelSize").min(1).max(50).step(1);

    const renderer = new THREE.WebGLRenderer({ canvas });
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(
      45,
      clientWidth / clientHeight,
      0.1,
      1000,
    );
    scene.background = new THREE.Color(0x000000);
    cam.position.set(0, 0, 500);

    const light = new THREE.DirectionalLight(0xffffff);
    light.intensity = 5;
    light.position.set(0, 0, 1);
    scene.add(light);

    const geometry = new THREE.BoxGeometry(200, 200, 200);
    const loader = new THREE.TextureLoader();
    const texture = loader.load("/texture-img-03.jpg");
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0x00ff00,
      // wireframe: true,
      // normalMap: texture,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer.render(scene, cam);

    const composer = new EffectComposer(renderer);
    composerRef.current = composer;
    composer.addPass(new RenderPass(scene, cam));

    /*examples effect */
    // const filmPass = new FilmPass();
    // composer.addPass(filmPass);

    const mosaicPass = new ShaderPass(mosaicShader);
    mosaicPass.uniforms.uPixelSize.value = mosaicParams.current.pixelSize;
    mosaicPass.uniforms.uResolution.value = new THREE.Vector2(
      clientWidth,
      clientHeight,
    );
    composer.addPass(mosaicPass);

    let rot = 0;
    const animate = () => {
      rot += 1;

      mesh.rotation.x = Math.cos((rot * Math.PI) / 180);
      mesh.rotation.y += 0.01;
      mosaicPass.uniforms.uPixelSize.value = mosaicParams.current.pixelSize;
      // renderer.render(scene, cam);
      composer.render();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <div id="guiContainer"></div>
      <canvas className="article-canvas" ref={canvasRef} />
    </div>
  );
}
