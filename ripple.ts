export const rippleShader = {
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

  vec2 offset = vec2(floorRand(uAngle, 1.0), floorRand(uAngle * 12.34, 1.0)) - 0.5;
  float dist = length(uv);
  float wave = sin(dist * 300.0 * uRms) * 0.1 * uRms;
  vec2 dir = normalize(uv);
  vec2 distortedUV = uv + dir * wave;

  vec2 finalUv = mix(uv + 0.5, distortedUV + 0.5, floorRand(uAngle, 3.0));

  vec4 color = texture2D(tDiffuse, finalUv);
  gl_FragColor = color;
}
`,
} ;
