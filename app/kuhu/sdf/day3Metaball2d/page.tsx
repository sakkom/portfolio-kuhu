"use client";

import { Article } from "@/app/comps/Article";
import Sdf2D from "./Sdf2d";
import { memo } from "./memo";
import "highlight.js/styles/atom-one-dark.css";
import "@/app/styles/article.css";

export default function Page() {
  const title = "2D SDFでメタボール風";
  const date = "2025.11.24";
  const link = `${process.env.NEXT_PUBLIC_GITHUB_LINK}/sdf/day3Metaball2d`;

  return (
    <div style={{ width: "100vw", minHeight: "100vh" }}>
      <Article
        title={title}
        date={date}
        link={link}
        canvas={<Sdf2D />}
        memo={memo}
      />
    </div>
  );
}
