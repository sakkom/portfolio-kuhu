export const sketch0119 = {
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

vec3 getOffset(float s) {
  return vec3(
    rand1(s),
    rand1(s + 1.23),
    rand1(s + 4.56)
  );
}

mat3 rotateX(float angle) {
  float c = cos(angle), s = sin(angle);
  return mat3(
    1.0, 0.0, 0.0,
    0.0, c, -s,
    0.0, s, c
  );
}

mat3 rotateY(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(
    c, 0., s,
    0., 1., 0.,
    -s, 0., c
  );
}

mat3 rotateZ(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  vec3 ro = vec3(0.0, 0.0, 3.);
  vec3 rd = normalize(vec3(uv, -1.));

  float t = 0.;
  float d = 999.;
  for (float i = 0.; i < 64.; i++) {
    vec3 p = ro + rd * t;

    d = 999.;
    // pos.z += cos(p.x * 10.0) * 0.1;
    vec3 pos = rotateX(uTime) * p;

    for (float j = 0.; j < 10.; j++) {
      pos.y += sin(p.x * 0.5) * 0.1;

      vec3 offset = (getOffset(j) * 2.0 - 1.0) * 2.0;
      float shpere = length(p - offset) - 0.5;

      float line = length((pos - offset).yz) - 0.05;
      d = min(d, line);
    }

    if (d < 0.001) break;
    t += d;
  }

  float col = step(d, 0.001);

  gl_FragColor = vec4(vec3(col), 1.0);
}
`,
} ;
