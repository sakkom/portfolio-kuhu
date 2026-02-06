export const fbShader = {
uniforms : {
tCurrent : { value : null },
tPrev : { value : null },
uTime : { value : null },
uCC : { value : new Array( 6 ) . fill(0)},
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
uniform sampler2D tCurrent;
uniform sampler2D tPrev;
uniform float uTime;
uniform float uCC[6];

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}
vec2 getOffset2(vec2 p) {
  return vec2(rand2(p) - 0.5, rand2(p * 12.34) - 0.5);
}
float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}
float floorRand(float t, float speed) {
  return rand1(floor(t * speed));
}
vec3 hsl2rgb(vec3 hsl) {
  float h = hsl.x;
  float s = hsl.y;
  float l = hsl.z;

  vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
}
float lumi(vec3 color) {
  return dot(color, vec3(0.3, 0.59, 0.11));
}

void main() {
  vec2 uv = vUv;

  vec4 currentColor = texture2D(tCurrent, uv);
  vec4 normalPrev = texture2D(tPrev, uv);

  vec2 noiseUv = uv + getOffset2(floor(uv * 10.0) + floorRand(uTime, 2.0)) * 0.05;

  vec4 glitchPrev = texture2D(tPrev, (uv - .5) * .95 + .5);
  vec4 glitch0Prev = texture2D(tPrev, noiseUv);

  vec3 color = currentColor.rgb;
  color += glitch0Prev.rgb * uCC[0] * 0.9;
  color = mix(color, glitchPrev.rgb, uCC[1] * 0.8);

  gl_FragColor = vec4(color, 1.0);
}
`,
} ;
