"use client";

const code1 = `
  const animate = () => {
    const time = clock.getElapsedTime();
    const { strength } = updateCubesEffect(
      effect,
      guiPropsRef.current.balls,
      time,
      noise2D,
    );
    effect.reset();

    cam.position.set(0, 0, strength * 2.0);

    composer.render();
    requestAnimationFrame(animate);
  };
  `;
const code0 = `
  function setMarchingCubesEffect() {
    const material = new THREE.MeshPhongMaterial({
      emissive: 0x000000,
    });
    const effect = new MarchingCubes(100, material);
    return effect;
  }


  function updateCubesEffect(
    effect: MarchingCubes,
    numBalls: number,
    time: number,
    noise2D: ReturnType<typeof createNoise2D>,
  ) {
    effect.reset();

    const subtract = numBalls * 2.0;
    const strength = 1.0 / Math.sqrt(numBalls);
    const speed = time * 0.2;

    for (let i = 0; i < numBalls; i++) {
      const x = 0.5 + noise2D(i + speed, i + speed) * 0.2;
      const y = 0.5 + noise2D(i * 1.2 + speed, i * 1.2 + speed) * 0.1;
      const z = 0.5 + noise2D(i * 1.3 + speed, i * 1.3 + speed) * 0.1;

      effect.addBall(x, y, z, strength, subtract * 3.0);
    }
    effect.update();
    return { strength };
  }
  `;
const about0 = `
    今日は文化の日ということでShaderをひとまず休みMarchingCubesを触ってみました。
    バグを発生させずに動作するようにコーディングを行いました。
  `;
const about1 = `
  MarchingCubesの初期化後にアニメーション関数でキューブを循環させる必要があります。reset(),addBall(),update()の手順。
  基本的なアイデアとしてボールを増やしてみようと思いました。
  ボールの大きさはstrengthで決まります。1.0を初期値に考えて動かしました。ですがボールが増えるにつれてバグが生じました。
  原因は主にMarchingCubesの座標系と体積によるものだと考えました。
  MarchingCubes空間は[-1, 1]というカメラ(私はfarを1000に設定)に対して非常に近い場所に存在しています。
  その範囲は[0, 1]という空間に正規化されており、その空間に対して同じ大きさでボールを発生させると体積が溢れててバグが生じると考えました。
  もう一つのバグの原因はaddBall()で0.5のオフセットで中央からの移動を算出する際にも生じました。[0, 1]の移動では球が見切れてしまうというものでした。
  そこで[0.3, 0.7]や[0.4, 0.6]での移動をすることでバグを抑えることができました。
  ボールの数と大きさは平方根と反比例で調整を行いました。1->100の数の増加を想像すると[1, 0.1]になることがわかります。
  実際は大きさが小さくなるにしたがって解像度が低下するためにボールのパラメータは押さえてあります。
  ボールの融合度は数増加による効果の縮小に伴い、数と同期して大きくすることで調整を行いました。
  `;
const about2 = `
  [-1, 1]?の空間なのでz=1で見ることができるのですが、数増加に伴い大きさは小さくなるため大きさの変数のstrengthと同期して1->0に近づくようにしました。
  すこし俯瞰してみたいので3->0に調節をしました。
  `;

export const memo = () => {
  return (
    <>
      <p className="description">{about0}</p>
      <pre>
        <code className="language-typescript">{code0}</code>
      </pre>
      <p className="description">{about1}</p>
      <pre>
        <code className="language-typescript">{code1}</code>
      </pre>
      <p className="description">{about2}</p>
    </>
  );
};
