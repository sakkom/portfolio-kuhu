import * as THREE from "three";

export function vj2PhotoMusic(scene: THREE.Scene) {
  const group = new THREE.Group();
  const textures: THREE.Texture[] = [];
  const loader = new THREE.TextureLoader();
  let mat: THREE.ShaderMaterial;

  const init = () => {
    for (let i = 1; i <= 108; i++) {
      const path = `/photomusic/${String(i).padStart(3, "0")}.jpg`;
      textures.push(loader.load(path));
    }
    const geo = new THREE.PlaneGeometry(
      (2 * window.innerWidth) / window.innerHeight,
      2,
    );
    mat = new THREE.ShaderMaterial({
      uniforms: {
        uTex: { value: textures[0] },
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
        void main() {
          vec2 blockUv = vUv;
          blockUv.y = floor(vUv.y * 10.) / 10.;
          float a = atan(vUv.y, vUv.x);
          float length = length(vUv -0.5);
          vec2 offsetUv = vec2(vUv.x + floor(fract(uTime) * 10.) * 0.05 , vUv.y + floor(fract(uTime) * 10.) * 0.01 );
          vec2 rotateUv = mod(uIndex, 2.0) == 0. ? rotatePos(vUv-.5, 3.14) + 0.5 : vUv ;
          vec3 tex = texture2D(uTex, rotateUv).rgb;
          float l = lumi(tex);
          float stepL =  step(l, 0.7) ;
          float col = pow(l, .8);
          if(mod(uIndex, 2.) == 0.) {
            gl_FragColor = vec4(vec3(1.-col), 1.);
          } else {
            gl_FragColor = vec4(vec3(col), 1.);
          }
          // gl_FragColor = vec4(vec3(stepL), 1.);

        }
      `,
    });
    mat.depthTest = false;
    mat.depthWrite = false;
    group.add(new THREE.Mesh(geo, mat));
    scene.add(group);
  };

  const update = (props: any) => {
    const beatFloat = (props.bpm / 60) * props.time;
    const index = Math.floor(beatFloat * 4) % 15;
    // const index = Math.floor(props.bpmCount * 30) % 15;
    mat.uniforms.uTex.value = textures[index];
    mat.uniforms.uTime.value = props.time;
    mat.uniforms.uIndex.value = index;
  };

  return {
    get mesh() {
      return group;
    },
    init,
    update,
  };
}
