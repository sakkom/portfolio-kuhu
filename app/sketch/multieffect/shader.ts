export const overlapShader = {
uniforms : {
uKick : { value : null },
uTime : { value : 0.0 },
uTimeTex : { value : null },
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
uniform sampler2D uTimeTex;

vec3 hsl2rgb(vec3 hsl) {
  float h = hsl.x;
  float s = hsl.y;
  float l = hsl.z;

  vec3 rgb = clamp(abs(mod(h * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
}

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;
  float audio = texture(uTimeTex, vec2(1.0, 0.5)).r * 0.5 + 0.5;

  vec2 pos = uv - 0.5;

  for (float i = 0.0; i < 10.0; i++) {
    float scale = (tanh(uTime * 2.0) * 0.5 + 0.5) * 8.5;
    // float scale = fract(audio * 0.1) * 10.5;
    float angle = length(pos) * scale;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 pos1 = rot * pos;

    // float scale2 = (sin(audio * 10.0));
    float scale2 = fract(uTime * 0.1) - 0.5;
    vec2 pos2 = pos1 + angle / 3.14 * scale2;

    pos = pos2;
  }

  vec3 balls = vec3(0.0);
  float ball = length(pos) - 0.25;
  float col = smoothstep(0.5, -0.1, abs(ball));
  balls += col;

  gl_FragColor = vec4(balls * 1.1, 1.0);
}
`,
} ;
