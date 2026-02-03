export const scene3Shader = {
uniforms : {
uRmsTime : { value : 0.0 },
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
uniform float uRmsTime;

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
  float t = uRmsTime;

  vec2 pos = uv * 2.0 - 1.0;
  float posScale = stepRand(t, 5.0) * 25.0 + 5.0;
  pos *= posScale;

  float lines = 0.0;
  float dist = 100.0;

  float loopNum = stepRand(t, 5.0) * 90.0 + 10.0;

  for (float i = 0.0; i < loopNum; i++) {
    float angle = (6.28 / stepRand(t, 1.0));
    pos = rotatePos(pos, angle);

    float noiseRatio = stepRand(t, 1.0) * 0.5;
    float wave = rand1(pos.x * 5.0) * stepRand(t, 10.0) * noiseRatio;
    float magic = 5.0;
    float line = abs(pos.y - (i / magic) + wave);

    float thinkness = 0.3;
    //animation frame
    float frameRate = 100.0;
    dist = opSmoothUnion(dist, line, stepRand(t, frameRate) * thinkness);
    pos *= 0.98;

    float isTwo = mod(uRmsTime, 1.0) > 0.5 ? 1.0 : 0.0;
    pos += isTwo * (stepRand(t, 1.0) - 0.5) * posScale;
  }

  vec3 lineDraw = vec3(dist);
  vec3 backCol = vec3(1.0);

  float mixRatio = stepRand(t, 1.0) * 0.2;
  vec3 color1 = mix(lineDraw, backCol, step(mixRatio, dist));
  vec3 color2 = mix(lineDraw, backCol, step(dist, mixRatio));
  vec3 color = mix(color1, color2, step(stepRand(t, 5.0), 0.5));

  gl_FragColor = vec4(color, 1.0);
}
`,
} ;
