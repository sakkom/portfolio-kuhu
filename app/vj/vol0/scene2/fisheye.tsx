export const fisheye0109 = {
uniforms : {
tDiffuse : { value : null },
uRmsTime : { value : null },
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
uniform float uRmsTime;
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
  vec2 uv = vUv;

  vec2 distoredUv = (uv - 0.5) * length(uv - 0.5) * (1.0 - uRms + 0.3);
  distoredUv += 0.5;
  // vec2 finalUv = mix(uv, distoredUv, step(floorRand(uRmsTime, 0.1), 0.5));

  gl_FragColor = texture2D(tDiffuse, distoredUv);
}
`,
} ;
