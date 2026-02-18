import * as THREE from "three";

export function vj2Walk(scene: THREE.Scene) {
  const group = new THREE.Group();
  let mat: THREE.ShaderMaterial;
  let video: HTMLVideoElement;

  const init = () => {
    video = document.createElement("video");
    // video.src = "/photomusic/P2160091.MOV";
    video.src = "/vj2/run4_0217.mov";
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

          vec2 blockUv = vUv;
          blockUv.x += (rand1(floor(uTime)) - 0.5) * 0.2;

          for(float i = 0.; i< 20.; i++) {
            float size = floor(rand2(floor(blockUv * 50.)) * 100.0);

            blockUv = floor(blockUv * size) / size;
          }
          blockUv.x = abs(vUv.x - 0.5);
          // blockUv.x += getOffset1(blockUv.y).x * 0.01;
          // blockUv.x += getOffset2(blockUv).x * 0.03;
          vec3 tex = texture2D(uTex, blockUv + vec2(0.43, 0.)).rgb;
          float l = lumi(1.-tex);
          vec3 color = vec3(pow(tex, vec3(.5)));
          // vec3 stepColor = 1.-vec3(step(color, vec3(0.5)));
          vec3 stepColor = 1.-vec3(step(1.-l, .5));
          // stepColor *= vec3(0.1, 1.0, 0.8);
          gl_FragColor = vec4(vec3(pow(1.-l, 1.5)), 1.);
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
