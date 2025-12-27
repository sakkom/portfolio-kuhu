export const boxShder = {
uniforms : {
uTime : { value : null },
uTimeTex : { value : null },
uKick : { value : null }
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
uniform float uKick;
uniform sampler2D uTimeTex;

float rand1(float y) {
  return fract(sin(y * 12.9898) * 43758.5453123);
}

vec2 rot(vec2 p, float a) {
  mat2 r = mat2(cos(a), -sin(a), sin(a), cos(a));
  return p * r;
}

void main() {
  vec2 uv = vUv - 0.5;
  vec3 boxes = vec3(0.0);
  float loopNum = 100.0;

  float audio = texture2D(uTimeTex, vec2(1.0, 0.5)).r * 0.5;

  uv += 0.5;
  // uv = fract(uv * 3.0);
  uv -= 0.5;
  for (float i = 0.0; i < loopNum; i++) {
    float baseAngle = 3.14 / 10.0;
    // vec2 uv1 = rot(uv, baseAngle / fract(audio + uTime * 0.1));
    vec2 uv1 = rot(uv, baseAngle * uKick + fract(uTime * 0.01));
    uv = uv1;

    float dist1 = min(abs(uv.x), abs(uv.y)) - 0.01;
    float dist2 = max(abs(uv.x), abs(uv.y)) - 0.5;
    // float dist2 = length(uv) - 0.5;
    float dist = mix(dist2, dist2, uKick);
    float col = smoothstep(0.001, -0.0, abs(dist));
    boxes += col;

    uv *= 1.05;
    // uv = fract(uv + 0.5) - 0.5;
  }
  gl_FragColor = vec4(boxes / 1.0, 1.0);
}
`,
} ;
