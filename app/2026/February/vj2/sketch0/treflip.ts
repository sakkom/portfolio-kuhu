import * as THREE from "three";

export function vj2Treflip(scene: THREE.Scene) {
  const group = new THREE.Group();
  let mat: THREE.ShaderMaterial;
  let video: HTMLVideoElement;

  const init = () => {
    video = document.createElement("video");
    // video.src = "/photomusic/P2160091.MOV";
    video.src = "/vj2/treflip2_0217.mov";
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
          vec3 tex = texture2D(uTex, vUv).rgb;
          float l = lumi(1.-tex);
          float lPress = pow(l, 15.);
          vec3 rgbColor;
          float size = floor(rand2(floor(vUv * 100.)) * 10.0);
          vec2 blockUv = floor(vUv * size) / size;
          vec2 noiseUv = vUv + getOffset1(l) * 0.0;
          float floorL = floor((1.-l) * 20.);
          rgbColor.r = texture2D(uTex, noiseUv - getOffset1(floorL) * 1.0).g;
          rgbColor.g = texture2D(uTex, noiseUv + getOffset1(floorL + 1.234) * 1.0).g;
          rgbColor.b = texture2D(uTex, noiseUv + getOffset1(floorL + 5.678) * 1.0).g;
          float rLumi = lumi(rgbColor);
          if(rLumi > .35) {
            rgbColor = 1.0- rgbColor;
          } else {
            rgbColor = pow(rgbColor, vec3(100.0));
          }
          // vec3 finalColor = mix(vec3(lPress), pow(rgbColor, vec3(2.)), 0.5);
          rgbColor = mix(vec3(1.), rgbColor, 0.8);
          vec3 finalColor = vec3(lPress) + pow(rgbColor, vec3(10.0)) * 10.0;

          gl_FragColor = vec4(vec3(finalColor), 1.);
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
