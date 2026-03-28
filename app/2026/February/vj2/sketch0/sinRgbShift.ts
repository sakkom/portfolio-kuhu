import * as THREE from "three";

export function vj2sinRgbShiftSketch(scene: THREE.Scene) {
  const group = new THREE.Group();
  let smoothBuffer = new Float32Array(256).fill(0);

  const aspect = window.innerWidth / window.innerHeight;

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform float uTime;
    uniform sampler2D uTex;
    uniform float uAspect;
    uniform sampler2D uAudio;

    float rand1(float y) {
      return fract(sin(y * 12.9898) * 43758.5453123);
    }
    float rand2(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    vec2 getOffset2(vec2 p) {
      return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
    }
    vec2 rotatePos(vec2 p, float a) {
      return p * mat2(cos(a), -sin(a), sin(a), cos(a));
    }

    vec3 hsl2rgb(vec3 hsl) {
      float h = hsl.x;
      float s = hsl.y;
      float l = hsl.z;
      vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
      return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
    }
    float lumi(vec3 color) {
      return dot(color, vec3(0.3, 0.59, 0.11));
    }

    void main() {
      vec2 uv = vUv - .5;
      // uv.x *= uAspect;
      uv.x *= 4./3. * (sin(-uTime * 0.25) * 0.5 + 0.5);
      // uv.x *= 4./3. * 0.25;


      // float circleDist = length(circleUv) - .25;
      // float col = step(circleDist, .0);

      float audio = texture2D(uAudio, vec2(vUv.x, .5)).r;

      vec3 mixShifts = vec3(0.);
      for(float i = 0.; i < 15.; i++) {
        // float radius = i/15. * 0.1;
        float radius = (sin(-uTime * 0.25) * 0.5 + 0.5) * 0.85 + 0.15;
        vec3 shiftCircle = vec3(0.);

        vec2 circleUv = uv;
        // circleUv.x = abs(uv.y);
        // if(rand1(i) > 0.2) {
        //   circleUv += getOffset2(circleUv) * 0.1;
        // }
        // circleUv.x = uv.x * i/15.;
        // circleUv = rotatePos(circleUv, uTime * 0.1 + i/15.);

        // float sinDiffX = sin(uv.x * i/15. * 20. + uTime) *  0.1;
        float sinDiffX = (i/15. - 0.5) * .0;
        float sinDiffY = cos(uv.x * i/15. * 30. - uTime) * 0.1;
        float sinDiffY2 = cos(uv.x * i/15. * 30. + uTime) * 0.1;

         sinDiffY += audio * 1.5;
         sinDiffY2 += audio * 1.5;

        shiftCircle.r = length(circleUv + vec2(sinDiffX, sinDiffY)) - radius * i /15.;
        // shiftCircle.g = length(circleUv) - radius *  i /15. * 1.25;
        shiftCircle.g = 1.0;
        shiftCircle.b = length(circleUv - vec2(sinDiffX, sinDiffY)) - radius *  i /15. * 1.0;

        shiftCircle.r = abs(circleUv.y + sinDiffY) - radius * i /15.;
        shiftCircle.g = 1.;
        shiftCircle.b = abs(circleUv.y - sinDiffY2) - radius * i/15.;


        vec3 iCircle = step(abs(shiftCircle), vec3(0.001));

        mixShifts += iCircle;
        // circleUv *= 1.01;
      }

      float mixShiftsMono = 1.-step(lumi(mixShifts), 0.0);

      gl_FragColor = vec4(vec3(mixShifts / 1.), 1.);
      gl_FragColor = vec4(vec3(mixShiftsMono / 1.), mixShiftsMono);
    }
  `;

  const uniforms = {
    uTime: { value: 0.0 },
    uTex: { value: null },
    uAspect: { value: aspect },
    uAudio: { value: null },
  };

  const init = () => {
    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthTest: false,
      transparent: true,
    });
    // const image = new THREE.TextureLoader().load("/texture-img-03.jpg");
    // mat.uniforms.uTex.value = image;
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    scene.add(group);
  };

  const clock = new THREE.Clock();
  const update = (props: any) => {
    uniforms.uAudio.value = props.audio;
    uniforms.uTime.value = clock.getElapsedTime();
  };

  return {
    get mesh() {
      return group;
    },
    init,
    update,
  };
}
