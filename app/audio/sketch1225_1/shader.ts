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

  vec2 pos = uv - 0.5;
  vec3 balls = vec3(0.0);

  float loopNum = 500.0;
  float ballLoopNum = 0.0;

  for (float i = 0.0; i < loopNum; i++) {
    float ni = (i + 1.0) / loopNum;

    float noise = texture2D(uTimeTex, vec2(1.0, 0.5)).r;
    pos.x += fract(uTime * 100.0) - 0.5;

    vec2 circlePosition = vec2(cos(ni * 6.28), sin(ni * 6.28));
    vec2 offset = circlePosition * 0.5 * noise;

    float ballDist = length(pos - offset) - 0.1;

    float ballColor = smoothstep(0.2, -0.2, ballDist);
    vec3 unique = vec3(rand1(ni));

    balls += ballColor * unique;
  }

  gl_FragColor = vec4(balls, 1.0);
}
`,
} ;
