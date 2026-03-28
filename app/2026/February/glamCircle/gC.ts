import * as THREE from "three";

export function gLCircle(scene: THREE.Scene) {
  const group = new THREE.Group();

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

    void main() {
      vec2 uv = vUv;
      vec2 scaleUv = uv - 0.5;

      vec2 absUv = pow(abs(scaleUv), vec2(1.));

      float size = rand2(floor(absUv * 3. + uTime * 1.)) * 2.;
      absUv = fract(absUv * size);

      vec3 texCol = texture2D(uTex, absUv).rgb;
      gl_FragColor = vec4(vec3(absUv, 1.), 1.0);
      gl_FragColor = vec4(vec3(texCol), 1.0);
    }
  `;

  const uniforms = {
    uTime: { value: 0.0 },
    uTex: { value: null },
  };

  const init = () => {
    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthTest: false,
    });
    const image = new THREE.TextureLoader().load("/texture-img-03.jpg");
    mat.uniforms.uTex.value = image;
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    scene.add(group);
  };

  const update = () => {
    uniforms.uTime.value += 0.01;
  };

  return {
    get mesh() {
      return group;
    },
    init,
    update,
  };
}
