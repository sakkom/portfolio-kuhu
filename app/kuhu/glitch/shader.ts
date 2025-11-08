export const glitchShader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: null },
    uTime: { value: 0 },
    uBlockSize: { value: null },
    uBlockSegment: { value: null },
    uLineHeight: { value: null },
    uLineWidth: { value: null },
    uLineSegment: { value: null },
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
    uniform float uBlockSize;
    uniform float uBlockSegment;
    uniform float uLineHeight;
    uniform float uLineWidth;
    uniform float uLineSegment;

    in vec2 vUv;

    float rand2(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p.x * p.y) * 43758.5453123);
    }

    float rand1(float y) {
      return fract(sin(y * 12.9898) * 43758.5453123);
    }

    void main() {
      vec2 uv = vUv;
      float timeVal = floor(uTime * 1.0);

      float trigger = rand1(floor(uTime * 5.0));
      if(trigger > 0.7) {
        vec2 seg = floor(uv * uBlockSegment) / uBlockSegment;
        float randomPixel = rand2(seg + sin(timeVal)) * uBlockSize - uBlockSize * 0.5;
        vec2 blockUV = floor(uv * uResolution / randomPixel) * randomPixel / uResolution;

        float segY = floor(uv.y * uLineSegment) / uLineSegment;
        float randomHeight = max(rand1(segY + sin(timeVal)) * uLineHeight, 1.0);
        //セグメントに従ってピクセル化のrowのheightが決まる。フラグメントはピクセル化された[0, 1]たとえばsegmentが2なら[0, 0.5]において
        //ピクセル化された値の離散値になるそれは最終的に必ず[0, 1]の範囲で決定される。離散値は一様分布なようになるはず。
        float row = floor(uv.y * uResolution.y / randomHeight) * randomHeight / uResolution.y;
        //[-uLineWidth/2, uLineWidth / 2]
        // だからrowはsegemtntでピクセル化された値。離散値は[0, 1]において一様分布なようになるはず。だからsegementを経由して
        // yは[0, 1]でそれぞれのピクセルrowが生成されるのでその値に従ってrand1(row)になる。
        float randomWidth = rand1(row) * uLineWidth - uLineWidth * 0.5;
        //[-uLineWidth/2, 0] or [0, uLineWidth/2]
        // -*-で+になり[0, 1]になるはず、マイナスのインデックスは-1 * -10 = 10 / uResolution.xで正規化され
        // 戻るはずなのに
        float col = floor(uv.x * uResolution.x / randomWidth) * randomWidth / uResolution.x;
        vec2 lineUV = vec2(col, row);

        vec4 tex1 = texture2D(tDiffuse, blockUV);
        vec4 tex2 = texture2D(tDiffuse, lineUV);

        gl_FragColor = mix(tex1, tex2, 0.5);
      }
      else {
        gl_FragColor = texture2D(tDiffuse, uv);
      }
    }
  `,
};
