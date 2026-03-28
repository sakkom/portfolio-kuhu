import * as THREE from "three";

export function vj2Suzuki(scene: THREE.Scene) {
  const group = new THREE.Group();
  let mat: THREE.ShaderMaterial;
  let video: HTMLVideoElement;

  const init = () => {
    video = document.createElement("video");
    // video.src = "/photomusic/P2160091.MOV";
    // video.src = "/videos/lE6CYn1i6nXTV_x-xN7LZa-RJz2a1C8B_r2vI86L5-c.mov";
    video.src = "/videos/3578236-hd_1920_1080_25fps.mp4";
    // video.src = "/photomusic/P2160106.MOV";
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
        varying vec2 vUv;
        uniform float uTime;
        uniform sampler2D uTex;

        float lumi(vec3 color) {
          return dot(color, vec3(0.3, 0.59, 0.11));
        }
        float rand1(float y) {
          return fract(sin(y * 12.9898) * 43758.5453123);
        }
        float rand2(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        vec2 getOffset2(vec2 p) {
          return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
        }
        vec2 getOffset1(float index) {
          return vec2(rand1(index) - 0.5, rand1(index + 12.34) - 0.5);
        }
        void main() {
          vec2 uv = vUv;
          vec3 color = texture2D(uTex, uv).rgb;
          vec3 rotColor = vec3(
            sin(uTime + rand1(uTime)) * 0.5 + 0.5,
            cos(uTime+ rand1(uTime)) * 0.5 + 0.5,
            sin(uTime+ rand1(uTime)) * 0.5 + 0.5
          );
          color *= rotColor;

          float l = lumi(color) * 1.5;

          vec3 finalColor = pow(color, vec3(1.5-l));
          gl_FragColor = vec4(finalColor, 1.0);
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
