export const rmsShader = {
uniforms : {
uKick : { value : null },
uTime : { value : 0.0 },
uRms : { value : null },
uZcr : { value : null },
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
uniform float uTime;
uniform float uRms;
uniform float uZcr;

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv - 0.5;

  uv += vec2(rand2(uv) - 0.5, rand2(uv * 12.34) - 0.5) * uZcr * 5.0;
  float ball = length(uv) - 0.25;

  vec3 red = vec3(1.0, 0.0, 0.0);
  vec3 colBall1 = vec3(smoothstep(0.1, 0.0, ball));

  gl_FragColor = vec4(vec3(colBall1), 1.0);
}
`,
} ;
