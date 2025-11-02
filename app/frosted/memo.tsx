"use client";
import { frostedShader } from "./shader";

const code0 = `
    vec2 randomOffset = vec2(
      rand(uv) * 2.0 - 1.0,
      rand(vec2(uv.y, uv.x)) * 2.0 - 1.0
    );
    vec2 distortedCoord = uv + randomOffset * uRadius / uResolution;
    gl_FragColor  = texture2D(tDiffuse, distortedCoord);
    // gl_FragColor = vec4(vec3(rand(uv)), 1.0);
  `;

const code1 = `
    float rand(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p.x * p.y) * 43758.5453123);
    }
  `;

const code2 = `
    const mouse = new THREE.Vector2();
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = 1 - (e.clientY - rect.top) / rect.height;
      frostedPass.uniforms.uMouse.value.set(mouse.x, mouse.y);
    };
    window.addEventListener("mousemove", handleMouseMove);
  `;

const code3 = `
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    in vec2 vUv;

    void main() {
      vec2 uv = vUv;
      float min_res = min(uResolution.x, uResolution.y);
      vec2 normalizedCoord = (gl_FragCoord.xy * 2.0 - uResolution) / min_res;

      vec2 normalizedMouse = uMouse * 2.0 - 1.0;
      normalizedMouse *= uResolution / min_res;

      float dist = distance(normalizedMouse, normalizedCoord);
      float area = 0.5;

      if(dist >= area) {
      } else {
        gl_FragColor = texture2D(tDiffuse, uv);
      }
    }
  `;

const about = `
  すりガラス効果はある範囲で元のフラグメント座標をランダムに散らすことである。
  重要なのは擬似乱数生成であり、今回はclaudeに作ってもらったrand()を使用した。
  実際にグレースケールで画像を確認するとホワイトノイズのようなテクスチャとなりパターンが見られない関数になっている。

  rand()は[0, 1]の範囲で値を返すので[-1, 1]に変換することで散らす範囲に±でオフセットを決定する。
  オフセットで散らすのだけどxとyそれぞれのオフセットを用意する必要がある。もし一つのオフセットならば各ピクセル・隣接するピクセル
  はプラスならプラスにマイナスならマイナスに斜めに並行移動してしまう。なので各ピクセルごとにオフセットでベクトルをランダムにする必要がある。
  `;

export const memo = () => {
  return (
    <>
      <pre>
        <code className="language-glsl">{code1}</code>
      </pre>
      <pre>
        <code className="language-glsl">{code0}</code>
      </pre>
      <p className="description">{about}</p>
      <pre>
        <code className="language-typescript">{code2}</code>
      </pre>
      <p className="description">
        マウスを動かしたときにエフェクトがかかるように工夫した。
        マウスの座標をuMouseとしてシェーダーに渡したい。そのため左上原点の座標をシェーダー側の左下原点[0,
        1]で正規化し渡したい。mousemoveはwindowのピクセル座標を返すためcanvasのオフセットを考慮して正規化する。
        y軸は反転するので1.0を引く。たとえばcanvasの高さが5pxのときcanvas座標のy=5の上下運動はshader側では0の位置に向かうからである。
        <br />
      </p>
      <pre>
        <code className="language-glsl">{code3}</code>
      </pre>
      <p className="description">
        ここでは正方な円を書くために工夫をした。uvはgl_FragCoord/uResolutionで求められるがそこでは
        xとyは[0, 1]の範囲で正規化される。canvasの比率をどちらか片方を[0,
        1]にすることで結果としてのlengthは同じ長さの比率になるので正方な円を描ける。今回は小さい方に揃えて正規化をした。
        ちなみに中央原点にも変換をしておく。 たとえば幅が4px,
        高さが3pxのcanvasがあるのならば正規化された座標は[-4/3,
        4/3]となり高さは[-1, 1]のようになる。 比べるマウスも片方が[-1,
        1]の中央原点にそろえる。([-0.5, 0.5]ではなく)
        uMouseはすでに正規化された座標だけど比率を変換するためのピクセル解像度で割る必要があるので一度ピクセル座標に変換してから割ることで
        正規化がされる。
      </p>
    </>
  );
};
