export const rmsShader = {
uniforms : {
uTime : { value : null },
uKick : { value : null },
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

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 rotatePos(vec2 p, float a) {
  return p * mat2(cos(a), -sin(a), sin(a), cos(a));
}

float stepRand(float t, float speed) {
  return rand1(floor(t * speed));
}

vec3 hsl2rgb(vec3 hsl) {
  float h = hsl.x;
  float s = hsl.y;
  float l = hsl.z;

  vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
}

void main() {
  vec2 uv = vUv;

  float isBack = step(uRms, 0.3);

  uv += vec2(rand2(uv) - 0.5, rand2(uv * 12.34) - 0.5) * uZcr * 0.1;
  vec2 pos = uv;
  uv += 0.5;
  // uv.x = floor(uv.x * 10.0) / 10.0;
  uv -= 0.5;

  float loopNum = 51.0;

  vec3 lines = vec3(0.0);

  for (float j = 0.0; j < 2.0; j++) {
    for (float i = 0.0; i < loopNum; i++) {
      // pos = rotatePos(pos, 6.28 / i * 0.01);
      float ni = (i + 1.0) / loopNum;
      float line;
      float wave = sin(uRms * 1000.0) * 0.0;
      if (j == 0.0) {
        // line = abs(pos.x - (ni * uRms * 1.5));
        float line1 = abs(pos.y - (ni - 0.5) - uRms * 1.5 - wave);
        float line2 = abs(pos.x - (ni - 0.5) - uRms * 1.5 - wave);
        line = mix(line2, line1, isBack);
      } else if (j == 1.0) {
        pos.y = 1.0 - uv.y;
        pos.x = 1.0 - uv.x;
        float line1 = abs(pos.y - (ni - 0.5) - uRms * 1.5 - wave);
        float line2 = abs(pos.x - (ni - 0.5) - uRms * 1.5 - wave);
        line = mix(line2, line1, isBack);
      }
      float thinkness = 0.01;
      // vec3 lineCol = smoothstep(thinkness, 0.0, line) * hsl2rgb(vec3(i * (uv.x + 0.05) + uRms, 1.0, 0.5));
      vec3 col2 = vec3(rand1(i));
      vec3 lineCol = smoothstep(thinkness, 0.0, line) * col2 * uRms * 5.0;

      lines += lineCol;
    }
  }

  gl_FragColor = vec4(vec3(lines) / 1.0, 1.0);
}
`,
} ;
