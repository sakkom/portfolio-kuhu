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

vec2 translateDraw(vec2 p) {
  return p += p;
}

void main() {
  vec2 uv = vUv;
  vec2 pos = uv * 2.0 - 1.0;
  vec3 lines = vec3(0.0);

  // for (float i = 0.0; i < 5.0; i++) {
  //   // vec2 drawPos = pos;
  //   float angle = 0.3 * i;
  //   vec2 drawPos = pos + (vec2(cos(angle), sin(angle)) * 0.5);

  //   drawPos = rotatePos(pos, angle);

  //   drawPos = rotatePos(drawPos, angle);
  //   float line = length(drawPos) - 0.1;
  //   drawPos = rotatePos(drawPos, -angle);

  //   float circleCol = step(line, 0.001);
  //   lines += circleCol;
  // }

  // pos += 0.5;
  // pos = rotatePos(pos, 0.785);
  // float ball = abs(pos.y) - 0.01;
  // float ballCol = smoothstep(0.01, 0.0, ball);
  // lines += ballCol;

  for (float j = 0.0; j < 10.0; j++) {
    for (float i = 0.0; i < 100.0; i++) {
      vec2 basedPos = pos;

      float a = 6.28 / (mod(floor(uTime * 5.0), 30.0) + 1.0) * (i + 1.0) + 1.57;
      // vec2 offset = vec2(cos(a), sin(a)) * 0.1 * (j + 1.0);
      vec2 offset = vec2(cos(a), sin(a)) * 3.0 * (j + 1.0) / 3.0;
      basedPos += offset;

      float angle = mix(-a, a, -uTime * 0.1);
      basedPos = rotatePos(basedPos, -a);

      // float isLine = step(abs(basedPos.y), rand1(i) * 1.0 * (j + 1.0) / 10.0);
      float isLine = step(abs(basedPos.y), 3.0);

      float wave = pow(sin(basedPos.y * 5.0), 3.0) * 0.5;
      float line = abs(basedPos.x) - 0.005;
      float lineCol = smoothstep(0.15, -0.000, line);
      // vec3 unique = hsl2rgb(vec3(i / 2.0 + uTime * 0.1, 1.0, 0.5));
      vec3 unique = vec3(rand1(i)) + 0.5;

      lines += lineCol * isLine * unique;
      pos *= 1.2;
    }
  }

  gl_FragColor = vec4(vec3(lines) / 1.0, 1.0);
}
`,
} ;
