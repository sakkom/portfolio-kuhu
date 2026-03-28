import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Vj3Props } from "./page";

export function vj3Sketch0319(scene: THREE.Scene) {
  const group = new THREE.Group();
  const aspect = window.innerWidth / window.innerHeight;
  let mesh: THREE.Mesh;
  /*texture用 */
  const byteCode = 512;
  const heightLine = 512;
  const linerBuffer = new Float32Array(byteCode);
  const dataBuffer = new Float32Array(byteCode * byteCode);
  let video: HTMLVideoElement;

  const dataTex = new THREE.DataTexture(
    dataBuffer,
    byteCode,
    heightLine,
    THREE.RedFormat,
    THREE.FloatType,
  );
  dataTex.needsUpdate = true;

  const init = () => {
    video = document.createElement("video");
    video.src = "/vj3/video_601637104778477676-O2ReuoTY.MP4";
    // video.src = "/photomusic/matsu.mov";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.play();

    const videoTex = new THREE.VideoTexture(video);
    videoTex.minFilter = THREE.LinearFilter;
    videoTex.magFilter = THREE.LinearFilter;

    const geo = new THREE.PlaneGeometry(2, 2, byteCode, heightLine);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uAudioTexture: { value: dataTex },
        uTime: { value: null },
        uAspect: { value: aspect },
        uVideo: { value: videoTex },
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
        uniform sampler2D uAudioTexture;
        uniform sampler2D uVideo;


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
          float angle = atan(uv.y, uv.x);
          angle = angle < 0. ? angle + 6.28 : angle;

          vec2 newUv = uv;

          // uv.x += sin(angle * 3. + uTime) * 0.1;
          // uv.y += sin(angle * 3.) * 0.1;


          uv *= 2.;
          vec3 finalCol = vec3(0.);
          for(float i = 0.; i < 10.; i++) {
            vec2 offset = getOffset1(i + floor(-uTime * 5.));
            float ball = length(uv + offset * .1 ) - exp(.8 * i / 10.) * 0.2;
            float col = smoothstep(0.1, -0.1, (ball));
            // float col = smoothstep(0.05, 0., line);
            if(rand1(i + floor(uTime * 10.)) > 0.5) {
              finalCol += col * hsl2rgb(vec3(i + uTime, 0.5, .5)) * step(rand1(i + floor(-uTime * 10.)), .5);
            } else {
              finalCol += col * vec3(sin(i)) * step(rand1(i + floor(-uTime * 5.)), .5);
            }
          }


          gl_FragColor = vec4(vec3(1.-finalCol * 5.), 1.0);
        }
      `,
      wireframe: false,
    });
    const m = new THREE.Mesh(geo, mat);
    // mesh.rotateX(-0.785);
    mesh = m;
    group.add(m);
    scene.add(group);
  };

  let counter = 0;
  const clock = new THREE.Clock();
  const update = (props: Vj3Props) => {
    props.analyser.getFloatTimeDomainData(linerBuffer);
    dataBuffer.set(linerBuffer, counter * byteCode);
    counter++;
    if (counter >= heightLine) counter = 0;
    dataTex.needsUpdate = true;
    if (props.onBeat) {
      group.rotation.x -= 0.1;
    }
    (mesh.material as THREE.ShaderMaterial).uniforms.uTime.value =
      clock.getElapsedTime();
  };

  return {
    get mesh() {
      return group;
    },
    init,
    update,
  };
}
