import * as THREE from "three";

export const sdfShader = {
  uniforms: {
    uResolution: { value: new THREE.Vector2(0.0, 0.0) },
    uTime: { value: 0.0 },
  },
  vertexShader: `
  out vec2 vUv;
  void main() {
    vUv = position.xy;
    gl_Position = vec4(position, 1.0);
  }
  `,
  fragmentShader: `
  uniform vec2 uResolution;
  uniform float uTime;
  in vec2 vUv;

  float sdCircle(vec2 p, float radius) {
    return length(p) - radius;
  }

  float sdSquare(vec2 p, float size) {
    vec2 d = abs(p) - size;
    return max(d.x, d.y);
  }

  float sdUnion(float d1, float d2) {
    return min(d1, d2);
  }

  float sdSubtraction(float d1, float d2) {
    return max(-d1, d2);
  }

  float sdIntersection(float d1, float d2) {
    return max(d1, d2);
  }

  //https://iquilezles.org/articles/distfunctions/
  float opSmoothUnion( float d1, float d2, float k ) {
      k *= 4.0;
      float h = max(k-abs(d1-d2),0.0);
      return min(d1, d2) - h*h*0.25/k;
  }


  void main() {
    vec2 uv = vUv;
    uv.x *= uResolution.x / uResolution.y;

    float d1 = sdCircle(uv - vec2(-0.3, 0.0), 0.3);
    float d2 = sdSquare(uv - vec2(0.3, 0.0), 0.5);

    // float dist = min(dist1, dist2);
    /*
      二つのベン図空間、反転した-空間とそのままの空間が合点するときがdist < 0が成立。
      max()弾かれの概念。
    */
    // float dist = sdUnion(d1, d2);
    // float dist = sdSubtraction(d1, d2);
    // float dist = sdIntersection(d1, d2);
    float dist  = opSmoothUnion(d1, d2, 0.1);

    vec3 color;
    if(dist < 0.0) {
      color = vec3(1.0, 0.0, 0.0);
    } else if (dist < 0.01) {
      color = vec3(1.0);
    }
    else {
      color = vec3(0.0);
    }

    gl_FragColor = vec4(color, 1.0);
  }
  `,
};
