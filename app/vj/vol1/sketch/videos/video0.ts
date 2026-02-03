import * as THREE from "three";

export namespace vol1Video0 {
  export function videoS0(scene: THREE.Scene) {
    const group = new THREE.Group();
    let mesh: THREE.Mesh;
    let video: HTMLVideoElement;
    let texture: THREE.VideoTexture;
    let currentIndex = -1;

    const videos = [
      "/videos/cat.mp4", //neko
      // "/videos/vj1/74042-549754724.mp4", //tanpopo
      "/videos/vj1/34091-399913636_small.mp4", //手洗い。
      "/videos/vj1/2799-162896272_large.mp4", //katatumuri
      // "/videos/vj1/134791-760686019.mp4", //飛行機
    ];
    const setup = () => {
      video = document.createElement("video");
      video.src = "/videos/vj1/34091-399913636_small.mp4";
      video.loop = true;
      video.muted = true;

      texture = new THREE.VideoTexture(video);

      video.addEventListener("loadeddata", () => {
        const aspect = video.videoWidth / video.videoHeight;

        const geometry = new THREE.PlaneGeometry(1 * aspect, 1);
        const material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uTime: { value: null },
          },
          vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
          fragmentShader: `
          uniform sampler2D uTexture;
          uniform float uTime;
          varying vec2 vUv;

          float rand1(float y) {
            return fract(sin(y * 12.9898) * 43758.5453123);
          }
          float lumi(vec3 color) {
            return dot(color, vec3(0.3, 0.59, 0.11));
          }
          float floorRand(float t, float speed) {
            return rand1(floor(t * speed));
          }
          float rand2(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          vec2 getOffset(vec2 p) {
            return vec2(rand2(p) - 0.5, rand2(p*12.34) - 0.5);
          }

          vec3 hsl2rgb(vec3 hsl) {
            float h = hsl.x;
            float s = hsl.y;
            float l = hsl.z;

            vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
            return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
          }

          void main() {
            vec2 uv = vUv;
            float params0 = 100.0;
            float params1 = 0.5;

            if(floorRand(uTime, 50.0)> 0.1) {
              uv = fract(uv * params0);
            }

            uv += getOffset(uv) * 0.01;

            vec4 color = texture2D(uTexture, uv);

            float l = lumi(color.rgb);
            float col = step(l, params1);


            gl_FragColor = vec4(vec3(1.0-col) *hsl2rgb(vec3(uTime, 1.0, 0.5)) , 1.0);
          }
          `,
        });
        mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
      });
      video.play();
      scene.add(group);
    };

    const update = (context: any) => {
      if (!context) return;

      const index = Math.floor(context.time * 0.1) % videos.length;
      if (index != currentIndex) {
        currentIndex = index;
        video.src = videos[index];
        video.onloadedmetadata = () => {
          video.play();
        };
      }

      (mesh.material as THREE.ShaderMaterial).uniforms.uTime.value =
        context.time;
    };

    return {
      get mesh() {
        return group;
      },
      setup,
      update,
    };
  }
}
