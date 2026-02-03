import * as THREE from "three";

export namespace vol1S5 {
  export function sketchS5(scene: THREE.Scene) {
    const group = new THREE.Group();
    let planeMesh: THREE.Mesh | null = null;

    const setup = () => {
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
          uAudio: { value: new Float32Array(128) },
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
          uniform float uAudio[128];

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

            vec3 finalColor = uBackgroundColor;

            bool filled = false;

            float loopNum = 30.;

            int audioIndex = int(vUv.x * 128.0);
            float audio = uAudio[audioIndex];

            for(float i = .0; i < loopNum; i++) {
              vec2 uv0 = uv;
              float loopN = (i / loopNum);

              // uv0.x = floor(uv0.x * 1000.0) / 1000.0;
              uv0.y += getOffset2(uv0 + i).y *loopN * 0.1;

              uv0.x += rand1(i)* 0.5;
              // float wave = sin(uv0.x * loopN * 50.0) * loopN *0.5;
              float wave = sin(uv0.x * 10.0 + uTime) * loopN *audio;

              float line = abs(uv0.y - wave) - loopN * 0.5;

              if(line < .0 && !filled) {
              finalColor = mod(i, 2.) == .0 ? vec3(1.) : vec3(0.);
              // finalColor = hsl2rgb(vec3(rand1(i), 1.0, 0.5));
                // finalColor = vec3(rand1(i));
                filled = true;
              }
            }

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `,
        side: THREE.DoubleSide,
      });

      planeMesh = new THREE.Mesh(geometry, material);
      group.add(planeMesh);
      scene.add(group);
    };

    const update = (context: any) => {
      if (!planeMesh || !(planeMesh.material instanceof THREE.ShaderMaterial)) {
        return;
      }

      if (planeMesh && planeMesh.material instanceof THREE.ShaderMaterial) {
        planeMesh.material.uniforms.uTime.value = context.time;
        if (context.onBeat) {
          planeMesh.material.uniforms.uAudio.value = context.buffer.slice(
            0,
            128,
          );
        }
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
