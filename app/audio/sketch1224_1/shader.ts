export const angleAudioShader = {
uniforms : {
uTime : { value : 0 },
uPrevTex : { value : null },
uAudio : { value : null },
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
uniform sampler2D uAudio;
uniform float uTime;

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

vec2 field(vec2 uv, float time) {
  float angle = sin(uv.x * 1.2) * cos(uv.y * 2.3) + sin(uv.y * 3.4) * cos(uv.x * 4.5);
  angle *= 6.28;
  float angle2 = cos(uv.x) + sin(uv.y) + tanh(uv.x);
  angle2 += uTime;
  angle2 *= 6.28;
  angle = angle + angle2 + uTime;
  // angle = angle2;
  return vec2(cos(angle), sin(angle));
}

float rand2(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  vec2 pos = uv - 0.5;
  float angle = atan(pos.y, pos.x);
  angle /= 3.14;
  angle = angle * 0.5 + 0.5;
  float noise = texture2D(uAudio, vec2(angle, 0.5)).r;

  float radius = 0.5;
  float ball = abs(length(pos) - radius);
  float col = smoothstep(0.1, -0.1, ball);

  // float wave = texture2D(uAudio, vec2(uv.x, 0.5)).r * 0.1 + fract(uTime * 10.0);
  // float y = abs(uv.y - wave);
  // float col = smoothstep(0.01, 0.0, y);
  // col *= (step(fract(uTime * 0.5), 0.5) - 0.5) * 2.0;

  vec3 color = vec3(
      col,
      col,
      col
    );

  vec2 flow = field(uv * 2.0, 0.0);
  vec3 tex = texture2D(uPrevTex, uv - flow * 0.01).rgb;
  tex *= 0.98;

  gl_FragColor = vec4(vec3(color + tex), 1.0);
}
`,
} ;
