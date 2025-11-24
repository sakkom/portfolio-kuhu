export const kaleidoShader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: null },
    uTime: { value: 0 },
    uSeg: { value: 0 },
  },
  vertexShader: `
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
  fragmentShader: `
precision mediump float;
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uTime;
uniform float uSeg;

in vec2 vUv;

float rand2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p.x * p.y) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;
  vec2 normalizedUV = (gl_FragCoord.xy * 2.0 - uResolution.xy) / max(uResolution.x, uResolution.y);
  // vec2 normalizedUV = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.xy;
  float dist = length(normalizedUV);
  // float dist = max(abs(normalizedUV.x), abs(normalizedUV.y));
  float angle = atan(normalizedUV.y, normalizedUV.x);
  // angle += sin(dist * 10.0 - uTime * 3.0) * 0.5;
  angle = angle < 0.0 ? angle + 6.28318 : angle;
  // angle += -uTime * 0.5;

  float seg = uSeg;
  float segAngle = 6.28318 / seg; //3.14
  angle = mod(angle, segAngle); //[0, seg-1]

  float halfSegment = segAngle * 0.5;
  if (angle > halfSegment) {
    angle = segAngle - angle;
  }

  vec2 kaleidoUV;
  kaleidoUV.x = cos(angle) * dist;
  kaleidoUV.y = sin(angle) * dist;
  // kaleidoUV.x += sin(uTime * 2.0) * 0.1;
  // kaleidoUV.y += cos(uTime * 2.0) * 0.1;

  kaleidoUV = kaleidoUV * 0.5 + 0.5;
  kaleidoUV *= 0.9;

  // gl_FragColor = vec4(angle / halfSegment, 0.0, 0.0, 1.0);
  // gl_FragColor = color;
  gl_FragColor = texture2D(tDiffuse, kaleidoUV);
}
`,
};
