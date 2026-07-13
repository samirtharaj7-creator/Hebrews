import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ChapterContentSchema, type ChapterContent } from "@/lib/schemas";
import { padChapter } from "@/lib/utils";

export const HEBREWS = {
  slug: "hebrews",
  name: "Hebrews",
  chapterCount: 13,
  verseCounts: [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25]
} as const;

export type ChapterAdjacency = { previous: number | null; next: number | null };

export function getHebrewsStaticParams() {
  return Array.from({ length: HEBREWS.chapterCount }, (_, index) => ({ chapter: String(index + 1) }));
}

export function parseHebrewsChapterNumber(chapter: number | string): number | null {
  const rawChapter = String(chapter);
  if (!/^[1-9]\d*$/.test(rawChapter)) return null;
  const chapterNumber = Number(rawChapter);
  if (!Number.isSafeInteger(chapterNumber) || chapterNumber > HEBREWS.chapterCount) return null;
  return chapterNumber;
}

export function getHebrewsChapter(chapter: number | string): ChapterContent | null {
  const chapterNumber = parseHebrewsChapterNumber(chapter);
  if (chapterNumber === null) return null;
  const path = join(process.cwd(), "content", HEBREWS.slug, `chapter-${padChapter(chapterNumber)}.json`);
  if (!existsSync(path)) return null;
  const parsed = ChapterContentSchema.parse(JSON.parse(readFileSync(path, "utf8")));
  const expectedVerseCount = HEBREWS.verseCounts[chapterNumber - 1];
  if (parsed.chapterNumber !== chapterNumber || parsed.verses.length !== expectedVerseCount) {
    throw new Error(`Hebrews ${chapterNumber} intake structure is invalid.`);
  }
  parsed.verses.forEach((verse, index) => {
    if (verse.verse !== `Hebrews ${chapterNumber}:${index + 1}`) {
      throw new Error(`Hebrews ${chapterNumber} contains an invalid verse slot.`);
    }
  });
  return parsed;
}

export function getHebrewsChapterAdjacency(chapter: number | string): ChapterAdjacency | null {
  const chapterNumber = parseHebrewsChapterNumber(chapter);
  if (chapterNumber === null) return null;
  return {
    previous: chapterNumber > 1 ? chapterNumber - 1 : null,
    next: chapterNumber < HEBREWS.chapterCount ? chapterNumber + 1 : null
  };
}
