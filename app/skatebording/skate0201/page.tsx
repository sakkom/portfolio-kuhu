"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default function DataMoshing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 1.5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const controls = new OrbitControls(camera, canvasRef.current);

    let feedbackTarget1: THREE.WebGLRenderTarget;
    let feedbackTarget2: THREE.WebGLRenderTarget;

    const video = document.createElement("video");
    // video.src = "/videos/skatebording/ryuto_push.mp4";
    // video.src = "/videos/skatebording/gokun_ollie.mp4";
    // video.src = "/videos/skatebording/ryuto_ollie.mp4";
    // video.src = "/videos/skatebording/ryuto&gokun_push.mp4";
    // video.src = "/videos/skatebording/ryuto_push1.mp4";
    // video.src = "/audio/Hull.mp4";
    video.src = "/videos/skatebording/gokun_k.mp4";
    video.loop = true;
    video.muted = false;

    video.onloadedmetadata = () => {
      const aspect = video.videoWidth / video.videoHeight;

      feedbackTarget1 = new THREE.WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight,
      );
      feedbackTarget2 = new THREE.WebGLRenderTarget(
        window.innerWidth,
        window.innerHeight,
      );

      const videoTex = new THREE.VideoTexture(video);
      videoTex.colorSpace = THREE.SRGBColorSpace;

      const quadGeometry = new THREE.PlaneGeometry(2, 2);
      const dataMoshMaterial = new THREE.ShaderMaterial({
        uniforms: {
          tCurrent: { value: videoTex },
          tPrevious: { value: null },
          uThreshold: { value: 0.99 }, // 動き検出の閾値
          uDecay: { value: 0.98 }, // ピクセルの減衰
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tCurrent;
          uniform sampler2D tPrevious;
          uniform float uThreshold;
          uniform float uDecay;
          varying vec2 vUv;

          float lumi(vec3 color) {
            return dot(color, vec3(0.3, 0.59, 0.11));
          }

          void main() {
            vec4 current = texture2D(tCurrent, vUv);
            vec4 previous = texture2D(tPrevious, vUv);

            //ryuto&gokun_push
            // float diff = length(pow(current.rgb, vec3(2.)) - pow(1.-previous.rgb, vec3(20.0)));
            //gokun_k
            float diff = length(pow(1.-current.rgb, vec3(.45)) - pow(1.0-previous.rgb, vec3(30.0)));
            //ryuto_ollie
            // float diff = length(pow(1.-current.rgb, vec3(20.0)) - pow(1.0-previous.rgb, vec3(20.0)));

            float updateMask = smoothstep(.6, 1., diff);


            vec4 decayedPrev = previous * 0.99;

            // vec4 result = mix(decayedPrev, current, updateMask);
            //gokun_k
            vec4 result = mix(decayedPrev, vec4(vec3(step(lumi(current.rgb), 0.99)), 1.0), updateMask);

            // gl_FragColor = vec4(vec3(step(0.5, lumi(result.rgb))), 1.0);
            gl_FragColor = vec4(result.rgb, 1.0);
          }
        `,
      });
      const feedbackQuad = new THREE.Mesh(quadGeometry, dataMoshMaterial);

      // 表示用のシーン
      const displayScene = new THREE.Scene();
      const displayMaterial = new THREE.MeshBasicMaterial();
      const displayGeometry = new THREE.PlaneGeometry(aspect * 1, 1);
      const displayMesh = new THREE.Mesh(displayGeometry, displayMaterial);
      displayScene.add(displayMesh);

      const feedbackScene = new THREE.Scene();
      feedbackScene.add(feedbackQuad);
      const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      let flip = false;

      const animate = () => {
        controls.update();

        if (video.currentTime > 0 && video.currentTime < 12) {
          displayMaterial.visible = true;
        } else {
          displayMaterial.visible = false;
        }

        const readTarget = flip ? feedbackTarget1 : feedbackTarget2;
        const writeTarget = flip ? feedbackTarget2 : feedbackTarget1;

        dataMoshMaterial.uniforms.tPrevious.value = readTarget.texture;
        renderer.setRenderTarget(writeTarget);
        renderer.render(feedbackScene, orthoCamera);

        displayMaterial.map = writeTarget.texture;
        displayMaterial.needsUpdate = true;
        renderer.setRenderTarget(null);
        renderer.render(displayScene, camera);

        flip = !flip;
        requestAnimationFrame(animate);
      };
      animate();
    };

    const handleClick = async () => {
      await video.play();
    };

    window.addEventListener("click", handleClick, { once: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      feedbackTarget1?.dispose();
      feedbackTarget2?.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
