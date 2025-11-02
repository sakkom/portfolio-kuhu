"use client";
import { linerShader } from "./shader";

const code0 = linerShader.fragmentShader;

const about = `
    どちらか一方で考える事から始めた。
    y=0のときを想定しx軸[0, 1]を[0, freq]の入力にしてsin関数の出力によりいくつかの波が発生するようにパラメータを用意した。
    uAmpはこの場合高さでありsin関数の出力[-1, 1]はuv座標に対しての操作であるため縮小して[-0.1, 0.1]が最大となるように調整した。
    今回は正弦波で揺らぎを実装したがいろいろな波で試してみるのが応用になってくるのだと思った。
  `;

export const memo = () => {
  return (
    <>
      <pre>
        <code className="language-glsl">{code0}</code>
      </pre>
      <p className="description">{about}</p>
    </>
  );
};
