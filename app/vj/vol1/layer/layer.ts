import { AudioAnalyser } from "@/app/audio/util";
import * as THREE from "three";

export namespace layerVol1 {
  export function layserSketch0(scene: THREE.Scene) {
    const group = new THREE.Group();
    let planeMesh: THREE.Mesh | null = null;
    let audioTexBuffer: Float32Array<ArrayBuffer>;
    let textureData: THREE.DataTexture;
    let smoothBuffer: Float32Array<ArrayBuffer>;
    const bufferSizes = [128, 256, 512, 1024, 2048];

    const setup = () => {
      audioTexBuffer = new Float32Array(2048);
      smoothBuffer = new Float32Array(2048);
      textureData = new THREE.DataTexture(
        smoothBuffer,
        2048,
        1,
        THREE.RedFormat,
        THREE.FloatType,
      );
      textureData.needsUpdate = true;

      const geometry = new THREE.PlaneGeometry(
        (1.0 * window.innerWidth) / window.innerHeight,
        1.0,
      );

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0.0 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
          },
          uBackgroundColor: { value: new THREE.Color(0x000000) },
          uAudioTex: { value: textureData },
        },
        vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec2 uResolution;
          uniform vec3 uBackgroundColor;
          uniform sampler2D uAudioTex;

          varying vec2 vUv;

          struct Circle {
            float index;
            bool filled;
          };

          float rand1(float y) {
            return fract(sin(y * 12.9898) * 43758.5453123);
          }
          float rand2(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          vec2 getOffset2(vec2 p) {
            return vec2(rand2(p) - 0.5, rand2(p*12.34) - 0.5);
          }
          vec2 getOffset1(float index) {
            return vec2(rand1(index) - 0.5, rand1(index+12.34) - 0.5);
          }
          float floorRand(float t, float speed) {
            return rand1(floor(t * speed));
          }

          vec3 hsl2rgb(vec3 hsl) {
            float h = hsl.x;
            float s = hsl.y;
            float l = hsl.z;

            vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
            return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
          }
          vec2 rotatePos(vec2 p, float a) {
            return p * mat2(cos(a), -sin(a), sin(a), cos(a));
          }

          void main() {
            vec2 uv = vUv - 0.5;

            uv += getOffset2(uv) * 0.01;

            float audio = texture2D(uAudioTex, vUv).r;
            float line = (uv.y - audio);
            float col = step(abs(line), 0.01);

            // gl_FragColor = vec4(vec3(col) * hsl2rgb(vec3(rand1(floor(vUv.x * 500.) + floorRand(uTime, 5.0)),1., 0.5)), col);
            gl_FragColor = vec4(vec3(col) * rand1(floor(vUv.x * 500.) + floorRand(uTime, 5.0)), col);
          }
        `,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });

      planeMesh = new THREE.Mesh(geometry, material);
      group.add(planeMesh);
      scene.add(group);
    };

    const update = (context: any) => {
      if (!planeMesh || !(planeMesh.material instanceof THREE.ShaderMaterial)) {
        return;
      }
      const sizeIndex = Math.floor(
        (Math.sin(context.time) * 0.5 + 0.5) * bufferSizes.length,
      );
      textureData.dispose();
      textureData = new THREE.DataTexture(
        smoothBuffer,
        bufferSizes[sizeIndex],
        1,
        THREE.RedFormat,
        THREE.FloatType,
      );
      textureData.needsUpdate = true;
      planeMesh.material.uniforms.uAudioTex.value = textureData;

      AudioAnalyser.getData(context.analyser, audioTexBuffer);
      for (let i = 0; i < audioTexBuffer.length; i++) {
        smoothBuffer[i] =
          smoothBuffer[i] * 0.98 + audioTexBuffer[i] * 0.02 * context.ampBuffer;
      }

      if (planeMesh && planeMesh.material instanceof THREE.ShaderMaterial) {
        planeMesh.material.uniforms.uTime.value = context.time;
      }
    };

    return {
      get mesh() {
        return group;
      },
      setup,
      update,
    };
  }
  export function layserSketch1(scene: THREE.Scene) {
    const group = new THREE.Group();
    let planeMesh: THREE.Mesh | null = null;
    let audioTexBuffer: Float32Array<ArrayBuffer>;
    let textureData: THREE.DataTexture;
    let smoothBuffer: Float32Array<ArrayBuffer>;
    const bufferSizes = [128, 256, 512, 1024, 2048];

    const setup = () => {
      audioTexBuffer = new Float32Array(1024);
      smoothBuffer = new Float32Array(1024);
      textureData = new THREE.DataTexture(
        smoothBuffer,
        1024,
        1,
        THREE.RedFormat,
        THREE.FloatType,
      );
      textureData.needsUpdate = true;

      const geometry = new THREE.PlaneGeometry(
        (4.5 * window.innerWidth) / window.innerHeight,
        4.5,
      );

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0.0 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
          },
          uBackgroundColor: { value: new THREE.Color(0x000000) },
          uAudioTex: { value: textureData },
        },
        vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec2 uResolution;
          uniform vec3 uBackgroundColor;
          uniform sampler2D uAudioTex;

          varying vec2 vUv;

          struct Circle {
            float index;
            bool filled;
          };

          float rand1(float y) {
            return fract(sin(y * 12.9898) * 43758.5453123);
          }
          float rand2(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          vec2 getOffset2(vec2 p) {
            return vec2(rand2(p) - 0.5, rand2(p*12.34) - 0.5);
          }
          vec2 getOffset1(float index) {
            return vec2(rand1(index) - 0.5, rand1(index+12.34) - 0.5);
          }
          float floorRand(float t, float speed) {
            return rand1(floor(t * speed));
          }

          vec3 hsl2rgb(vec3 hsl) {
            float h = hsl.x;
            float s = hsl.y;
            float l = hsl.z;

            vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
            return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
          }
          vec2 rotatePos(vec2 p, float a) {
            return p * mat2(cos(a), -sin(a), sin(a), cos(a));
          }

          void main() {
            vec2 uv = vUv - 0.5;

            uv.y += 0.5;
            uv.y = fract(uv.y * 100.);
            uv.y -= 0.5;

            float audio = texture2D(uAudioTex, uv + 0.5).r * 10.;
            float line = (uv.y - audio);
            float col = step(abs(line), 0.15);
            // float col = 1.0 - smoothstep(0.0, 0.1, line);

            gl_FragColor = vec4(vec3(col) * 1.0 * hsl2rgb(vec3((audio * 0.5 + 0.5) * 1. + uTime * 0.1, 1., 0.5)) , 1.0);
          }
        `,
        side: THREE.DoubleSide,
        // transparent: true,
        // depthWrite: false,
        // depthTest: false,
      });

      planeMesh = new THREE.Mesh(geometry, material);
      planeMesh.position.z = -5;
      group.add(planeMesh);
      scene.add(group);
    };

    const update = (context: any) => {
      if (!planeMesh || !(planeMesh.material instanceof THREE.ShaderMaterial)) {
        return;
      }
      // const sizeIndex = Math.floor(
      //   (Math.sin(context.time) * 0.5 + 0.5) * bufferSizes.length,
      // );
      // textureData.dispose();
      // textureData = new THREE.DataTexture(
      //   smoothBuffer,
      //   bufferSizes[sizeIndex],
      //   1,
      //   THREE.RedFormat,
      //   THREE.FloatType,
      // );
      textureData.needsUpdate = true;
      planeMesh.material.uniforms.uAudioTex.value = textureData;

      AudioAnalyser.getData(context.analyser, audioTexBuffer);
      for (let i = 0; i < audioTexBuffer.length; i++) {
        smoothBuffer[i] =
          smoothBuffer[i] * 0.98 + audioTexBuffer[i] * 0.02 * context.ampBuffer;
      }

      if (planeMesh && planeMesh.material instanceof THREE.ShaderMaterial) {
        planeMesh.material.uniforms.uTime.value = context.time;
      }
    };

    return {
      get mesh() {
        return group;
      },
      setup,
      update,
    };
  }
}
