"use client";
// import Mosaic from "./Mosaic";
import "highlight.js/styles/atom-one-dark.css";
import "@/app/styles/article.css";
import { Article } from "../../comps/Article";
import Metaball from "./Metaball";
import { memo } from "./memo";

export default function Page() {
  const title = "MarchingCubesでボールの大きさを保ちボールの数を増やす";
  const date = "2025.11.03";
  const link = `${process.env.NEXT_PUBLIC_GITHUB_LINK}/metaball`;

  return (
    <div style={{ width: "100vw", minHeight: "100vh" }}>
      <Article
        title={title}
        date={date}
        link={link}
        canvas={<Metaball isHome={false} />}
        memo={memo}
      />
    </div>
  );
}
