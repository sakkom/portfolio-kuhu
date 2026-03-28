import * as THREE from "three";

export function MountSketch2(scene: THREE.Scene) {
  const group = new THREE.Group();
  const aspect = window.innerWidth / window.innerHeight;
  let mesh: THREE.Mesh;

  const init = () => {
    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: null },
        uAspect: { value: aspect },
        uMix: { value: null },
      },

      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,

      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform float uAspect;
        uniform float uMix;

        float rand1(float y) {
          return fract(sin(y * 12.9898) * 43758.5453123);
        }
        vec2 getOffset1(float index) {
          return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
        }
        float lumi(vec3 color) {
          return dot(color, vec3(0.3, 0.59, 0.11));
        }
        vec2 rotatePos(vec2 p, float a) {
          return p * mat2(cos(a), -sin(a), sin(a), cos(a));
        }
        float rand2(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        vec2 getOffset2(vec2 p) {
          return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
        }

        void main() {
          vec2 uv = vUv - .5;
          uv.x *= uAspect;

          vec2 progressOffset = getOffset1(floor(uMix * 10.)) * 0.5;
          uv += progressOffset;

          vec2 warpUv = uv;
          warpUv.x += (sin(warpUv.x * 45.) + cos(warpUv.y * 25. + uTime * 3.)) * 0.01;
          warpUv.y += (sin(warpUv.y * 35.) + cos(warpUv.x * 10.)) * 0.01;




          vec3 finalCol = vec3(0.);


          float loopNum = 30.;
          float r = 0.25;
          // float r = fract(uTime) * .5;

          for(float i = 0.; i < loopNum; i++) {
            // warpUv.x *= sin(uTime * 0.5);
            // warpUv.x += (rand1(i)  - .5) * 0.5;
            // warpUv += getOffset2(warpUv) * 0.01 * i/ loopNum;

            float circleDist = length(warpUv) - r;
            // float col = step(abs(circleDist), i / loopNum * .5);
            float col = step((circleDist), 0.);

            // finalCol += col * vec3(sin(i)) * rand2(warpUv);
            finalCol += col * vec3(sin(i)) * rand2(floor(warpUv * 800.) / 800.);
            // warpUv = rotatePos(warpUv, i / loopNum * 6.28 + uTime * 0.5);
            warpUv = rotatePos(warpUv + getOffset1(i) * 0.1, rand1(i) * 6.28 + floor(uTime * 5.) * (i + 1.) / loopNum );
            warpUv *= 1.1;
            // warpUv.x += rand1(uTime * 0.5);
          }

          finalCol = pow(finalCol, vec3(3.));

          gl_FragColor = vec4(vec3(finalCol), uMix);
        }
      `,
      wireframe: false,
      transparent: true,
    });
    const m = new THREE.Mesh(geo, mat);
    mesh = m;
    group.add(m);
    scene.add(group);
  };

  let counter = 0;
  const clock = new THREE.Clock();
  const update = () => {
    (mesh.material as THREE.ShaderMaterial).uniforms.uTime.value =
      clock.getElapsedTime();
  };

  return {
    get mesh() {
      return group;
    },
    init,
    update,
    setProgress: (value: number) => {
      (mesh.material as THREE.ShaderMaterial).uniforms.uMix.value = value;
    },
  };
}
