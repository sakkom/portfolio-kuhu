export const bpmShader = {
uniforms : {
uBpm : { value : null },
uTime : { value : null },
uBeats : { value : null },
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
uniform float uBpm;
uniform float uTime;
uniform float uBeats;
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

vec2 rotatePos(vec2 p, float a) {
  return p * mat2(cos(a), -sin(a), sin(a), cos(a));
}

void main() {
  vec2 uv = vUv;

  int bs = int(floor(uBeats));
  int bIndex = bs % 4;

  vec3 color;
  if (bIndex == 2) {
    float circles = 0.0;
    for (float i = 0.0; i < 30.0; i++) {
      float circle = length(uv - 0.5) - fract(uTime * i / 30.0);
      float circleCol = smoothstep(0.03, -0.0, abs(circle));
      circles += circleCol;
    }
    if (bs % 8 == 2) {
      color = vec3(1.0 - circles);
    } else {
      color = vec3(circles);
    }
  } else if (bIndex == 1) {
    vec2 pos = uv - 0.5;
    float lines = 0.0;
    for (float i = 0.0; i < 30.0; i++) {
      pos = rotatePos(pos, rand1(i) / 1.57);
      float line = abs(pos.y - fract(uTime * i / 30.0));
      float lineCol = smoothstep(0.01, 0.0, line);
      lines += lineCol;
    }

    if (bs % 8 == 1) {
      color = vec3(1.0 - lines);
    } else {
      color = vec3(lines);
    }
  } else if (bIndex == 3)
  {
    vec2 pos = uv - 0.5;
    float rects = 0.0;
    for (float i = 0.0; i < 50.0; i++) {
      pos = rotatePos(pos, 3.14 / 5.0 * fract(uTime * 0.1));
      float rect = max(abs(pos.x), abs(pos.y)) - 0.5;
      float rectCol = smoothstep(0.01, -0.0, abs(rect));
      rects += rectCol;
      pos *= 1.05;
    }

    color = vec3(rects);
  }
  else if (bIndex == 0)
  {
    vec2 pos = uv - 0.5;
    float rects = 0.0;
    for (float i = 0.0; i < 30.0; i++) {
      pos = rotatePos(pos, 3.14 / 1.0 * fract(uTime * 0.1));
      float rect = length(pos - 0.5) - 0.25;
      float rectCol = smoothstep(0.1, -0.0, abs(rect));
      rects += rectCol;
      pos *= 1.05;
    }

    color = vec3(rects);
  }
  gl_FragColor = vec4(vec3(color), 1.0);
}
`,
} ;
