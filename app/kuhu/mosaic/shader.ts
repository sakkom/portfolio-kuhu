export const mosaicShader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: null },
    uPixelSize: { value: null },
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
    uniform float uPixelSize;

    in vec2 vUv;

    vec2 mosaic(vec2 pixelCoord, float uPixelSize) {
      vec2 index = floor(pixelCoord / uPixelSize);
      vec2 coord = index * uPixelSize;
      return coord;
    }

    void main() {
      vec2 uv = vUv;
      vec2 mosaicCoord = mosaic(uv * uResolution, uPixelSize);
      uv = mosaicCoord / uResolution;
      gl_FragColor  = texture2D(tDiffuse, uv);
    }
  `,
};
