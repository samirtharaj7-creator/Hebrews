"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteStyling() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const path = pathname.replace(/\/$/, "") || "/";
    const chapterMatch = path.match(/^\/hebrews\/(\d+)$/);

    html.classList.add("dark");
    html.style.colorScheme = "dark";
    body.classList.add("mbe-shell-managed");
    body.removeAttribute("data-hebrews-chapter");

    if (path === "/") body.dataset.hebrewsRoute = "home";
    else if (path === "/background") body.dataset.hebrewsRoute = "introduction";
    else if (path === "/articles" || path.startsWith("/articles/")) body.dataset.hebrewsRoute = "articles";
    else if (chapterMatch) {
      body.dataset.hebrewsRoute = "commentary";
      body.dataset.hebrewsChapter = chapterMatch[1];
    } else body.removeAttribute("data-hebrews-route");
  }, [pathname]);

  return null;
}
