import * as THREE from "three";

export function vj2Matsu(scene: THREE.Scene) {
  const group = new THREE.Group();
  let mat: THREE.ShaderMaterial;
  let video: HTMLVideoElement;

  const init = () => {
    video = document.createElement("video");
    video.src = "/photomusic/P2160091.MOV";
    video.src = "/photomusic/matsu.mov";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.play();

    const videoTex = new THREE.VideoTexture(video);
    videoTex.minFilter = THREE.LinearFilter;
    videoTex.magFilter = THREE.LinearFilter;

    const geo = new THREE.PlaneGeometry(
      (2 * window.innerWidth) / window.innerHeight,
      2,
    );
    mat = new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: videoTex },
        uTime: { value: 0 },
        uIndex: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTex;
        varying vec2 vUv;
        uniform float uTime;
        uniform float uIndex;
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
          vec2 blockUv = vUv;
          blockUv.y = floor(vUv.y * 10.) / 10.;
          float a = atan(vUv.y, vUv.x);
          float length = length(vUv -0.5);
          vec2 offsetUv = vec2(vUv.x + floor(fract(uTime) * 10.) * 0.05 , vUv.y + floor(fract(uTime) * 10.) * 0.01 );
          vec2 rotateUv = mod(uIndex, 2.0) == 0. ? rotatePos(vUv-.5, 3.14) + 0.5 : vUv ;
          vec3 tex = texture2D(uTex, vUv + getOffset2(vUv) * 0.01).rgb;
          float l = lumi(tex);
          float stepL =  step(l, 0.3) ;
          vec3 col = pow(vec3(l), vec3(2.));
          if(mod(uIndex, 2.) == 0.) {
            gl_FragColor = vec4(vec3(1.-col), 1.);
          } else {
            gl_FragColor = vec4(vec3(col), 1.);
          }
          gl_FragColor = vec4(vec3(col), 1.);
        }
      `,
    });
    mat.depthTest = false;
    mat.depthWrite = false;
    group.add(new THREE.Mesh(geo, mat));
    scene.add(group);
  };

  const update = (props: any) => {
    mat.uniforms.uTime.value = props.time;
    mat.uniforms.uIndex.value =
      Math.floor((props.bpm / 60) * props.time * 1) % 15;
  };

  return {
    get mesh() {
      return group;
    },
    init,
    update,
  };
}
