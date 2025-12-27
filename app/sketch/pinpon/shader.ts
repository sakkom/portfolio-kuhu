export const pinponShader = {
uniforms : {
uTime : { value : 0 },
uPrevTex : { value : null },
// uVideo : { value : null },
uMyname : { value : null },
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
uniform sampler2D uPrevTex;
// uniform sampler2D uVideo;
uniform sampler2D uMyname;
uniform float uTime;

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

vec2 field(vec2 uv, float time) {
  float angle = sin(uv.x * 1.2) * cos(uv.y * 2.3) + sin(uv.y * 3.4) * cos(uv.x * 4.5);
  angle *= 6.28;
  float angle2 = cos(uv.x) + sin(uv.y) + tanh(uv.x);
  // angle2 += uTime;
  angle2 *= 6.28;
  angle = angle + angle2 + uTime;
  return vec2(cos(angle), sin(angle));
}

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;

  vec2 flow = field(uv * 1.0, uTime);
  vec2 flowUv = uv - flow * 0.01;
  vec3 tex = texture2D(uPrevTex, flowUv).rgb;
  tex *= 0.99;

  float dist = length(uv - 0.5) - 0.1;
  float ballEdge = smoothstep(0.01, 0.0, abs(dist));
  vec3 ballColor = vec3(tex + ballEdge);
  // gl_FragColor = vec4(ballColor + tex, 1.0);

  vec3 flowColor = vec3(flow * 0.5 + 0.5, 1.0);
  // gl_FragColor = vec4(flowColor * 0.1 + tex, 1.0);

  vec2 pos = uv;
  float pointNum = 5.0;
  vec3 color = vec3(0.0);
  for (float i = 0.0; i < pointNum; i++) {
    vec2 point = vec2(rand1(i), rand1(i + 12.34));
    float ball = length(pos - point) - 1.0;
    float ballColor = smoothstep(0.03 * i / 10.0, 0.00, abs(ball));
    color += ballColor;
  }
  gl_FragColor = vec4(color + tex, 1.0);

  float random = rand2(floor(uv * 10.0));
  float white = step(random, 0.001);
  // white *= sin(uTime);
  // gl_FragColor = vec4(tex + white, 1.0);

  // vec3 video = texture2D(uVideo, uv).rgb;
  // gl_FragColor = vec4(tex + video * 0.1, 1.0);

  // vec3 video = texture2D(uMyname, uv).rgb;
  // gl_FragColor = vec4(tex + video * 0.2, 1.0);

  float linearX = abs(uv.x - fract(uTime * fract(uTime) * 0.1));
  float linearColorX = smoothstep(0.1, 0.00, abs(linearX));
  linearColorX *= (step(fract(-uTime * 0.5), 0.5) - 0.5) * 2.0;

  float linearY = abs(uv.y - fract(-uTime * fract(uTime) * 0.2));
  float linearColorY = smoothstep(0.1, 0.00, abs(linearY));
  linearColorY *= (step(fract(uTime * 0.5), 0.5) - 0.5) * 2.0;
  gl_FragColor = vec4(vec3(linearColorX + linearColorY + tex), 1.0);

  // vec2 poss = uv - 0.5;
  // float angle = atan(poss.y, poss.x);
  // float noise = sin(angle * 10.0) * 0.1;
  // float waveBall = length(poss) - noise;
  // float waveBallCol = step(waveBall, 0.2);
  // gl_FragColor = vec4(vec3(waveBallCol), 1.0);
}
`,
} ;
