
export const distortion0110 = {
uniforms : {
uResolution : { value : null },
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
uniform vec2 uResolution;
uniform float uAngle;
uniform float uRms;
uniform float uRmsTime;
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
  // uv.x *= uResolution.x / uResolution.y;

  float dist = length(uv);
  dist = pow(dist, 0.1);
  float a = uRmsTime * 0.1;
  // uv = uv * mat2(cos(a), sin(a), -sin(a), cos(a));
  // uv.y += fract(-uRmsTime * 100.0) - 0.5;
  // uv.y += uRms;

  // uv *= dist;
  // uv.y = floor(uv.y * 10.0) / 10.0;

  gl_FragColor = texture2D(tDiffuse, uv + 0.5);
}
`,
} ;
