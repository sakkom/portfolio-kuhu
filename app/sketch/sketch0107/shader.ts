export const sketch0107Shader = {
uniforms : {
uTime : { value : 0.0 },
uRms : { value : null },
uZcr : { value : null },
},
vertexShader : `
varying vec2 vUv;
uniform float uRms;
uniform float uZcr;

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

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

//https://iquilezles.org/articles/distfunctions/
float opSmoothUnion(float d1, float d2, float k) {
  k *= 4.0;
  float h = max(k - abs(d1 - d2), 0.0);
  return min(d1, d2) - h * h * 0.25 / k;
}

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 rotatePos(vec2 p, float a) {
  return p * mat2(cos(a), -sin(a), sin(a), cos(a));
}

vec3 hsl2rgb(vec3 hsl) {
  float h = hsl.x;
  float s = hsl.y;
  float l = hsl.z;

  vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
}

float floorRand(float t, float speed) {
  return rand1(floor(t * speed));
}

void main() {
  vec2 uv = vUv - 0.5;
  vec2 noisePos = uv + (rand2(vec2(uv.x + floorRand(uRms * uRms * uRms, 1.0), 0.0)) - 0.5) * mod(pow(uRms, 3.0), 0.5);
  float magic = uRms;
  float dist = abs(noisePos.y - (floorRand(uv.x * 2.0 + pow(uRms, 3.0) + uTime, 5.0) - 0.5) * mod(magic, 0.25)) - mod(pow(uRms, 3.0) + 0.001, 0.25);
  float line = step(dist, 0.0);
  vec3 color = hsl2rgb(vec3(dist * 1.5 + floorRand(uTime, 5.0), 0.5, 0.5));
  gl_FragColor = vec4(line * color, 1.0);
}
`,
} ;
