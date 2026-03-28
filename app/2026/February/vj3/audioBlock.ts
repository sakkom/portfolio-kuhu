import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Vj3Props } from "./page";

export function vj3AudioBlock(scene: THREE.Scene) {
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

        void main() {

          vec2 uv = vUv - .5;
          // uv.y /= uAspect;
          // uv = rotatePos(uv, uTime * 0.5);


          // uv *= sin(uTime);
          // uv *= 0.5;
          uv = abs(uv);

          float a = atan(uv.y, uv.x);
          a = a / 3.14 * 0.5 + 0.5;
          // a = abs(a - 0.5);
          float dist = length(uv);

          float audio = texture2D(uAudioTexture, vec2(dist, a )).r;

          uv.x += sin(audio) * 0.1;



          vec3 index = texture2D(uVideo, vec2(dist, a )).rgb;
          float l = lumi(index);

          vec2 shiftUv = vec2(vUv.x + getOffset1(l).x * 1., vUv.y + getOffset1(l).y * 1.);
          vec2 blockUv = floor(vUv * (l + 0.5) * 100.) / (l + 0.5) * 100.;

          float col = texture2D(uVideo, vec2(dist * (1.-l), a * l )).r;
          // col = step(col, 0.5);
          col = pow(col, 3.0);



          gl_FragColor = vec4(vec3(col), 1.);
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
