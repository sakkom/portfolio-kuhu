export const sketch1230Shader = {
uniforms : {
uTime : { value : 0.0 },
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

float stepRand(float t, float speed) {
  return rand1(floor(t * speed));
}

void main() {
  vec2 uv = vUv;

  vec2 pos = uv * 2.0 - 1.0;
  vec3 c1 = vec3(0.0);
  vec3 c2 = vec3(0.0);
  vec3 c3 = vec3(0.0);

  for (float i = 0.0; i < 10.0; i++) {
    float ni = (i + 1.0) / 10.0;
    // float line = step(abs(pos.y + (ni * 2.0) - 1.0 + tanh(pos.x * 10.0) * ni), 0.03);
    float line = smoothstep(0.1, -0.1, abs((pos.y + (ni * 2.0) - 1.0) + tanh(pos.x * 10.0) * ni));

    float circle = length(pos) - 1.0;
    vec3 circleIn = mix(vec3(0.0), vec3(line), step(circle, 0.0));
    c1 += circleIn;
    pos = rotatePos(pos, 6.28 / 5.0);
  }

  for (float i = 0.0; i < 20.0; i++) {
    float ni = (i + 1.0) / 20.0;
    // float line = step(abs(pos.x + (ni * 2.0) - 1.0), 0.01);
    float line = smoothstep(0.1, -0.1, abs((pos.x + (ni * 2.0) - 1.0) + tanh(pos.y * 10.0) * ni));
    float circle = length(pos) - 0.75;
    vec3 circleIn = mix(vec3(0.0, 0.0, 0.0), vec3(line), step(circle, 0.0));
    c2 += circleIn;
    // pos = rotatePos(pos, 6.28 / 5.0);
  }

  for (float i = 0.0; i < 20.0; i++) {
    vec3 grid = vec3(0.0);
    float ni = (i + 1.0) / 20.0;
    float offset = 0.0;
    float line1 = smoothstep(0.01, -0.01, abs(pos.x + (ni * 2.0) - 1.0 + offset));
    float line2 = smoothstep(0.1, -0.1, abs(pos.y + (ni * 2.0) - 1.0 + offset));

    float circle = length(pos + offset) - 1.0;
    vec3 circleMask1 = mix(vec3(0.0), vec3(line1), 1.0 - step(circle, 0.0));
    vec3 circleMask2 = mix(vec3(0.0), vec3(line2), 1.0 - step(circle, 0.0));
    grid += circleMask1 + circleMask2;
    c3 += grid;
  }
  vec3 layer1 = mix(c1, c3, 0.5) * 2.0;
  vec3 layer2 = mix(layer1, c3, 0.5);
  vec3 layer3 = mix(c1, c2, 0.5);
  vec3 color = c1 + c2 + c3;

  gl_FragColor = vec4(vec3(layer1) * 2.0, 1.0);
}
`,
} ;
