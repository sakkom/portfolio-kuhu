import Image from "next/image";
import Mosaic from "./kuhu/mosaic/Mosaic";
import Frosted from "./kuhu/frosted/Frosted";
import LinearSinDistortion from "./kuhu/linearSinDistortion/Linear";
import Link from "next/link";
import Metaball from "./kuhu/metaball/Metaball";
import Glitch from "./kuhu/glitch/Glitch";
import Ripple from "./kuhu/ripple/Ripple";

interface ArticleData {
  id: number;
  title: string;
  date: string;
}
const articles: ArticleData[] = [
  {
    id: 0,
    title: "EffectComposerでピクセル化シェーダー",
    date: "25.10.31",
  },
  {
    id: 1,
    title:
      "EffectComposerですりガラス効果・マウスムーブで正方円内でエフェクト無効化",
    date: "25.10.31",
  },
  {
    id: 2,
    title: "uv座標の正弦波ディストーションでの揺らぎ",
    date: "25.11.01",
  },
  {
    id: 3,
    title: "MarchingCubesでボールの大きさを保ちボールの数を増やす",
    date: "2025.11.03",
  },
  {
    id: 4,
    title: "セグメント分割によるランダムピクセル化グリッチ",
    date: "2025.11.08",
  },
  {
    id: 5,
    title: "uv座標のリップル効果",
    date: "2025.11.10",
  },
];

export default function Home() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "50%" }}>
        <div>Novmember</div>
        <Link href={"http://localhost:3000/kuhu/ripple"}>
          <h1>{articles[5].title}</h1>
          {/*<Ripple isHome={true} />*/}
          <Image src={"/gifs/article-05.gif"} alt="" width={700} height={500} />
        </Link>
        <Link href={"http://localhost:3000/kuhu/glitch"}>
          <h1>{articles[4].title}</h1>
          {/*<Glitch isHome={true} />*/}
          <Image src={"/gifs/article-04.gif"} alt="" width={700} height={500} />
        </Link>
        <Link href={"http://localhost:3000/kuhu/metaball"}>
          <h1>{articles[3].title}</h1>
          {/*<Metaball isHome={true} />*/}
          <Image src={"/gifs/article-03.gif"} alt="" width={700} height={500} />
        </Link>
        <Link href={"http://localhost:3000/kuhu/linearSinDistortion"}>
          <h1>{articles[2].title}</h1>
          <Image src={"/gifs/article-02.gif"} alt="" width={700} height={500} />
        </Link>
        <Link href={"http://localhost:3000/kuhu/frosted"}>
          <h1>{articles[1].title}</h1>
          <Image src={"/gifs/article-01.gif"} alt="" width={700} height={500} />
        </Link>
        <Link href={"http://localhost:3000/kuhu/mosaic"}>
          <h1>{articles[0].title}</h1>
          <Mosaic isHome={true} />
        </Link>
      </div>
    </div>
  );
}
