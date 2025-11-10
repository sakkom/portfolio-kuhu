export const rippleShader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: null },
    uTime: { value: 0 },
    uFreq: { value: 0 },
    uAmp: { value: 0 },
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
    uniform float uTime;
    uniform float uFreq;
    uniform float uAmp;
    in vec2 vUv;

    void main() {
      vec2 uv = vUv;
      float min_res = min(uResolution.x, uResolution.y);
      vec2 normalizedCoord = (gl_FragCoord.xy * 2.0 - uResolution) / min_res;

      float dist = length(normalizedCoord);
      float wave = sin(dist * uFreq -uTime * 5.0) * uAmp;
      vec2 dir = normalize(normalizedCoord);
      // vec2 dir = vec2(normalizedCoord.x / dist, normalizedCoord.y / dist);
      vec2 distortedUV = (uv + dir * wave);

      vec4 color = texture2D(tDiffuse, distortedUV);
      gl_FragColor = color;
    }
  `,
};
