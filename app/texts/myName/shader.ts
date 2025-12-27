export const myNameShader = {
  uniforms: {
    uTexture: { value: null },
    uTime: { value: 0 },
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
    uniform sampler2D uTexture;
    uniform float uTime;

    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      dist *= fract(uTime) * 1.0;
      // dist = pow(dist, 1.0);
      // uv = mat2(cos(dist), -sin(dist), sin(dist), cos(dist)) * uv;
      uv = uv + 0.5;
      vec3 color = texture2D(uTexture, uv).rgb;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};
