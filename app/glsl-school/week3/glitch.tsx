export const glitch0109 = {
uniforms : {
tDiffuse : { value : null },
uAngle : { value : null },
uRms : { value : null },
},
vertexShader : `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
fragmentShader : `
precision mediump float;
uniform sampler2D tDiffuse;
uniform float uAngle;
uniform float uRms;
in vec2 vUv;

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float floorRand(float t, float speed) {
  return rand1(floor(t * speed));
}

void main() {
  vec2 uv = vUv - 0.5;

  vec2 blockUv = uv;

  float swi = step(floorRand(uAngle, 0.5), 0.5);
  float randSeg = floorRand(uAngle * uRms, 1.0) * 1000.0 * uRms;
  blockUv.y = mix(floor(uv.y * randSeg) / randSeg, uv.y, swi);
  blockUv.x = mix(floor(uv.x * randSeg) / randSeg, uv.x, 1.0 - swi);

  gl_FragColor = texture2D(tDiffuse, blockUv + 0.5);
}
`,
} ;
