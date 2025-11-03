import Image from "next/image";
import Mosaic from "./kuhu/mosaic/Mosaic";
import Frosted from "./kuhu/frosted/Frosted";
import LinearSinDistortion from "./kuhu/linearSinDistortion/Linear";
import Link from "next/link";

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

        <Link href={"http://localhost:3000/kuhu/linearSinDistortion"}>
          <h1>{articles[2].title}</h1>
          <LinearSinDistortion isHome={true} />
        </Link>
        <Link href={"http://localhost:3000/kuhu/frosted"}>
          <h1>{articles[1].title}</h1>
          <Frosted isHome={true} />
        </Link>
        <Link href={"http://localhost:3000/kuhu/mosaic"}>
          <h1>{articles[0].title}</h1>
          <Mosaic isHome={true} />
        </Link>
      </div>
    </div>
  );
}
