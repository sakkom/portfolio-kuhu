export const fishShader = {
uniforms : {
tDiffuse : { value : null },
uTimeTex : { value : null },
uTime : { value : null },
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
uniform float uTime;

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;
  // float audio = texture2D(uTimeTex, vec2(uv.y * uv.x, 0.5)).r * 0.5 + 0.5;
  float audio = texture2D(uTimeTex, vec2(1.0, 0.5)).r * 0.5 + 0.5;

  float dist = length(uv - 0.5);
  float scale = (1.0 - audio) * 50.0;
  float wave = sin(dist * scale + uTime) * audio * 0.1;
  vec2 dir = normalize(uv - 0.5);
  // vec2 dir = vec2(normalizedCoord.x / dist, normalizedCoord.y / dist);
  vec2 distortedUv = (uv + dir * wave);

  vec4 color = texture2D(tDiffuse, distortedUv);

  gl_FragColor = color;
}
`,
} ;
