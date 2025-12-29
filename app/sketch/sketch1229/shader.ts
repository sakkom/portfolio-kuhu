export const sketch1229Shader = {
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

void main() {
  float gridSize = 3.0; //奇数対応
  float gridSpace = 2.0;
  vec2 uv = vUv * gridSize * 2.0 - gridSize;

  float halfPoint = 0.5;
  float radius = 0.5;

  //設定
  float diffuse = 0.3;

  //layers
  float gridBalls = 0.0;
  vec3 simpleBalls = vec3(0.0);
  float smoothBalls = 100.0;
  float gridBox = 0.0;

  vec3 colorSeed = vec3(0.0);
  float index = 0.0;

  vec2 pos = uv;
  float outGrid = 2.0;
  for (float j = 0.0; j < gridSize + outGrid; j++) {
    for (float i = 0.0; i < gridSize + outGrid; i++) {
      vec2 gridPos = vec2(0.0);

      gridPos.y = mod(j, 2.0) == 0.0 ? gridPos.y - (j / 2.0) * gridSpace : gridPos.y + ((j + 1.0) / 2.0) * gridSpace;
      gridPos.x = mod(i, 2.0) == 0.0 ? gridPos.x - (i / 2.0) * gridSpace : gridPos.x + ((i + 1.0) / 2.0) * gridSpace;

      float ball = length(pos - gridPos) - halfPoint * 2.0;
      float box = max(abs(pos.x - gridPos.x), abs(pos.y - gridPos.y)) - 1.0;
      float shape = mix(ball, box, fract(uTime * 0.1));
      float edge = smoothstep(0.01, -0.00, abs(ball));
      float boxEdge = smoothstep(0.01, -0.00, abs(box));
      gridBalls += edge;
      gridBox += boxEdge;

      for (float b = 0.0; b < 2.0; b++) {
        float seed = j + i + b;
        float randomStart = rand1(seed);
        float rotDir = (step(rand1(seed), 0.5) * 2.0 - 1.0) * uTime;
        float speed = (1.0 + rand1(seed));
        float a = randomStart * speed + rotDir;
        vec2 rotOffset = b == 0.0 ? vec2(cos(a), sin(a)) * 0.5 : vec2(cos(a), sin(a)) * (1.0 + radius);
        vec2 ballPos = pos - gridPos - rotOffset;

        ballPos += rand2(ballPos) * 0.1;

        float ball = length(ballPos) - radius;

        float edge = smoothstep(0.01, -0.0, abs(ball));
        simpleBalls += edge;

        smoothBalls = opSmoothUnion(smoothBalls, ball, diffuse);
      }
    }
  }

  float metaBall = smoothstep(0.1, -0.0, abs(smoothBalls));

  // vec3 layer1 = mix(vec3(gridBalls), vec3(balls), 0.5) * 1.0;
  vec3 layer1 = mix(vec3(gridBalls), vec3(metaBall), 0.5) * 1.0;
  vec3 color = mix(layer1, vec3(gridBox), 0.5) * 1.0;

  gl_FragColor = vec4(vec3(color) * 10.0, 1.0);
}
`,
} ;
