export const linerShader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: null },
    uFreq: { value: null },
    uAmp: { value: null },
  },
  vertexShader: `
    out vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision mediump float;
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uFreq;
    uniform float uAmp;
    in vec2 vUv;

    void main() {
      vec2 uv = vUv;
      uv.x += sin(vUv.y * uFreq) * uAmp;
      uv.y += sin(vUv.x * uFreq) * uAmp;
      gl_FragColor  = texture2D(tDiffuse, uv);
    }
  `,
};
