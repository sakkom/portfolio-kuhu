export const newYearShader = {
uniforms : {
uTex : { value : null },
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
uniform sampler2D uTex;
uniform float uTime;

float getMask(vec2 uv) {
  float texCol = texture2D(uTex, uv).r;
  return step(texCol, 0.1);
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
  uv.y *= 1.5;

  float d = 1.0 / 512.0 * 2.0;

  vec2 pos = uv - 0.5;
  pos.x *= 0.5;
  vec3 finalCol = vec3(0.0);
  float isStop = mod(uTime, 2.0) > 1.0 ? 0.0 : 1.0;
  pos.x += fract(+uTime * 14.0) * isStop - 0.1 * isStop;
  pos.x -= 0.1;

  // pos = isStop == 0.0 ? pos * 0.5 : pos * 0.8;
  for (float i = 0.0; i < 30.0; i++) {
    float r = getMask(pos + vec2(d, 0.0) + 0.5);
    float l = getMask(pos - vec2(d, 0.0) + 0.5);
    float t = getMask(pos + vec2(0.0, d) + 0.5);
    float b = getMask(pos - vec2(0.0, d) + 0.5);

    vec2 gradient = vec2(r - l, t - b);

    float edge = length(gradient);

    vec2 normal = normalize(gradient);

    vec2 tangent = vec2(-normal.y, normal.x);

    vec3 color = hsl2rgb(vec3(uTime + i / 30.0, 0.5, 0.5));
    vec3 e = step(0.1, edge) * color;
    finalCol += e;
    pos = pos * 1.1;
    // pos.x += pos.x * 0.1;
  }

  gl_FragColor = vec4(vec3(1.0 - finalCol) / 1.0, 1.0);
  // gl_FragColor = texture2D(uTex, uv);
}

`,
} ;
