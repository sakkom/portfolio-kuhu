import * as THREE from "three";

export function MountSketch1(scene: THREE.Scene) {
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

        vec3 hsl2rgb(vec3 hsl) {
          float h = hsl.x;
          float s = hsl.y;
          float l = hsl.z;
          vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
        }

        void main() {
          vec2 uv = vUv - .5;
          uv.x *= uAspect;

          // uv = fract((uv + .5) * 2.) - 0.5;
          // uv = abs(uv);
          // uv = rotatePos(uv, uTime * 0.1);
          // uv.x += sin(uv.y * 15.) * 0.05;
          // uv.y += sin(uv.x * 15.) * 0.05;

          vec2 progressOffset = getOffset1(floor(uMix * 10.)) * 0.5;
          uv += progressOffset;

          float angle = atan(uv.y, uv.x);
          angle = angle < 0. ? angle + 6.28 : angle;

          vec2 newUv = uv;

          // uv.x += sin(angle * 3. + uTime) * 0.1;
          // uv.y += sin(angle * 3.) * 0.1;


          uv *= 2.;
          vec3 finalCol = vec3(0.);
          float r = 0.25;
          // float r = fract(uTime) * .5;


          float speed = 5. / 2.;
          for(float i = 0.; i < 10.; i++) {
            vec2 offset = getOffset1(i + floor(-uTime * speed));
            float ball = length(uv + offset * .1 ) - exp(.8 * i / 10.) *r;
            float col = smoothstep(0.1, -0.1, (ball));
            // float col = smoothstep(0.05, 0., line);
            if(rand1(i + floor(uTime * speed * 2.)) > 0.5) {
              finalCol += col * hsl2rgb(vec3(i + uTime, 0.5, .5)) * step(rand1(i + floor(-uTime * speed * 2.)), .5);
            } else {
              finalCol += col * vec3(sin(i)) * step(rand1(i + floor(-uTime * speed)), .5);
            }
          }


          gl_FragColor = vec4(vec3(finalCol * 5.), uMix);
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
