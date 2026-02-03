export const NegaShader = {
  uniforms: {
    tDiffuse: { value: null },
    uLevel: { value: 0.0 },
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
      uniform sampler2D tDiffuse;
      uniform float uLevel;

      void main() {
        vec3 color = texture2D(tDiffuse, vUv).rgb;
        vec3 finalColor = mix(color, 1.0 - color, uLevel);
        // gl_FragColor = vec4(abs(uLevel- color), 1.0);
        gl_FragColor = vec4(finalColor, 1.0);
      }
      `,
};
