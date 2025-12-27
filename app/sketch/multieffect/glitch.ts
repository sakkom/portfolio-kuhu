export const glitchShader = {
uniforms : {
tDiffuse : { value : null },
uTimeTex : { value : null },
},
vertexShader : `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
fragmentShader : `
varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D uTimeTex;

void main() {
  vec2 uv = vUv;
  float audio1 = texture2D(uTimeTex, vec2(uv.x * uv.y, 0.5)).r * 0.5 + 0.5;
  // float audio2 = texture2D(uTimeTex, vec2(uv.y, 0.5)).r * 0.5 + 0.5;
  // float audio1 = texture2D(uTimeTex, vec2(1.0, 0.5)).r * 0.5 + 0.5;
  // float audio2 = texture2D(uTimeTex, vec2(0.5, 0.5)).r * 0.5 + 0.5;

  float blockSegX = audio1 * 100.0;
  float blockX = floor(uv.x * blockSegX) / blockSegX;
  float blockSegY = audio1 * 100.0;
  float blockY = floor(uv.y * blockSegY) / blockSegY;
  vec2 blockUv = vec2(blockX, blockY);

  vec4 color = texture2D(tDiffuse, blockUv);

  gl_FragColor = color;
}
`,
} ;
