import * as THREE from "three";

export const randVertexShader = {
  uniforms: {
    uMouse: { value: new THREE.Vector2(0.0, 0.0) },
    uResolution: {
      value: new THREE.Vector2(0.0, 0.0),
    },
  },
  vertexShader: `
  // attribute vec3 position;
  attribute vec4 color;
  attribute float size;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  varying vec4 vColor;

  float rand2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p.x * p.y) * 43758.5453123);
  }

  vec2 randomOffset(vec2 pos) {
    return vec2(
      rand2(pos),
      rand2(pos.yx)
    ) * 2.0 - 1.0;
  }


  vec2 aspectVec(vec2 uResolution) {
    if (uResolution.x > uResolution.y) {
      return vec2(uResolution.x / uResolution.y, 1.0);
    } else {
      return vec2(1.0, uResolution.y / uResolution.x);
    }
  }

  void main() {
    /*実際に長い方を長くする*/
    vec2 aspect = aspectVec(uResolution);
    vec2 pos = position.xy * aspect;
    vec2 mouse = uMouse * aspect;
    float aspectDist = length(pos - mouse);

    /*1より小さいときにradiusは累乗で0%に近づく*/
    /*1より大きいときは移動範囲は大きくなる*/
    float radius = pow(aspectDist * 1.0, 5.0);
    vec2 offset = randomOffset(pos);
    vec2 random = offset * radius;

    vec3 p = vec3(position.xy + random , 0.0);
    gl_Position = vec4(p, 1.0);

    vColor = vec4(vec3(0.0), 1.0);

    //aspectDistでscaleを計算するために最大値を考慮
    float aspectEdge = max(aspect.x, aspect.y) * 2.0;
    float maxDist = length(vec2(aspectEdge, 2.0));
    float normalizeDist = aspectDist / maxDist;
    float scale = pow(1.0 - normalizeDist, 5.0);
    gl_PointSize = size * scale;
  }
  `,
  fragmentShader: `
  varying vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
  `,
};
