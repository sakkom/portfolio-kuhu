import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Vj3Props } from "./page";

export function vj3Kido(scene: THREE.Scene) {
  const group = new THREE.Group();
  const aspect = window.innerWidth / window.innerHeight;
  let mesh: THREE.Mesh;
  /*texture用 */
  const byteCode = 512;
  const heightLine = 32;
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
    // video.src = "/vj3/videoplayback.mp4";
    // video.src = "/photomusic/matsu.mov";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.play();

    const videoTex = new THREE.VideoTexture(video);
    videoTex.minFilter = THREE.LinearFilter;
    videoTex.magFilter = THREE.LinearFilter;

    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uAudioTexture: { value: dataTex },
        uTime: { value: null },
        uBpmTime: { value: null },
        uAspect: { value: aspect },
        uVideo: { value: videoTex },
        uOnBeat2: { value: null },
      },

      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,

      fragmentShader: `
        in vec2 vUv;
        uniform float uTime;
        uniform float uBpmTime;
        uniform float uAspect;
        uniform bool uOnBeat2;
        uniform sampler2D uVideo;

        float rand2(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        vec2 getOffset2(vec2 p) {
          return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
        }
        float rand1(float y) {
          return fract(sin(y * 12.9898) * 43758.5453123);
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
        float lumi(vec3 color) {
          return dot(color, vec3(0.3, 0.59, 0.11));
        }
        vec2 getOffset1(float index) {
          return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
        }
        vec2 rotatePos(vec2 p, float a) {
          return p * mat2(cos(a), -sin(a), sin(a), cos(a));
        }
        vec2 lemniscate(float t, float scale) {
          float x = cos(t);
          float y = sin(t) * cos(t) * 1.0;
          return vec2(x, y) * scale;
        }
        float opSmoothUnion(float d1, float d2, float k) {
          k *= 4.0;
          float h = max(k - abs(d1 - d2), 0.0);
          return min(d1, d2) - h * h * 0.25 / k;
        }

        void main() {
          vec2 uv = vUv - 0.5;
          uv.x *= uAspect;

          float size = floor(rand2(floor(uv * 100.)) * 100.0);
          vec2 blockUv = floor(vUv * size) / size;


          float circleDist = length(uv);

          float col = pow(circleDist, 0.8);


          float l = lumi(vec3(col));

          vec2 bokashiUv = vUv + getOffset1(l)  * (1.-l);

          vec3 videoTex2 = texture2D(uVideo, bokashiUv).rgb;

          float circleDist2 = length(bokashiUv - 0.5);

          float l2 = lumi(vec3(circleDist2));

          // float stepCol = step(l2, 0.2);


          gl_FragColor = vec4(vec3(l2), 1.0);

        }
      `,
      // wireframe: true,
      transparent: true,
    });
    const m = new THREE.Mesh(geo, mat);
    // mesh.rotateX(-0.785);
    mesh = m;
    group.add(m);
    scene.add(group);
  };

  let counter = 0;
  const clock = new THREE.Clock();
  let bpmTime = 0;
  let bpmCounter = 0;
  const update = (props: Vj3Props) => {
    // props.analyser.getFloatTimeDomainData(linerBuffer);
    // dataBuffer.set(linerBuffer, counter * byteCode);
    // counter++;
    // if (counter >= heightLine) counter = 0;
    // dataTex.needsUpdate = true;
    // if (props.onBeat) {
    //   group.rotation.x -= 0.1;
    // }
    (mesh.material as THREE.ShaderMaterial).uniforms.uTime.value =
      clock.getElapsedTime();
    const bpmCount = Math.floor(((props.bpm * 2) / 60) * props.time);
    const onBpmCount = bpmCounter != bpmCount;
    bpmCounter = bpmCount;
    if (onBpmCount) {
      bpmTime += Math.random();
      (mesh.material as THREE.ShaderMaterial).uniforms.uBpmTime.value = bpmTime;
      // (mesh.material as THREE.ShaderMaterial).uniforms.uOnBeat2.value =
      //   props.onBeat;
    }
  };

  return {
    get mesh() {
      return group;
    },
    init,
    update,
  };
}
