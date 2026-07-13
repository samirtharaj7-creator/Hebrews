import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookChapterStrip } from "@/components/book-chapter-strip";
import { ChapterStudy, type PublicChapterContent } from "@/components/verse-accordion";
import { HEBREWS, getHebrewsChapter, getHebrewsChapterAdjacency, getHebrewsStaticParams } from "@/lib/hebrews";
import type { ChapterContent } from "@/lib/schemas";

export function generateStaticParams() {
  return getHebrewsStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }): Promise<Metadata> {
  const { chapter } = await params;
  const content = getHebrewsChapter(chapter);
  if (!content) notFound();
  return { title: `Hebrews ${content.chapterNumber}`, description: `Hebrews ${content.chapterNumber} commentary intake.` };
}

export default async function HebrewsChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  const content = getHebrewsChapter(chapter);
  const adjacency = getHebrewsChapterAdjacency(chapter);
  if (!content || !adjacency) notFound();
  const publicContent = withoutAuditSources(content);
  return (
    <main className="reader-page">
      <BookChapterStrip
        activeChapter={content.chapterNumber}
        bookSlug={HEBREWS.slug}
        bookName={HEBREWS.name}
        chapterCount={HEBREWS.chapterCount}
        verseCounts={HEBREWS.verseCounts}
      />
      <ChapterStudy chapter={publicContent} bookName={HEBREWS.name} />
      <nav className="reader-chapter-nav no-print" aria-label="Hebrews adjacent chapters">
        {adjacency.previous ? <Link href={`/hebrews/${adjacency.previous}`}><ChevronLeft className="h-4 w-4" />Hebrews {adjacency.previous}</Link> : <span />}
        {adjacency.next ? <Link href={`/hebrews/${adjacency.next}`}>Hebrews {adjacency.next}<ChevronRight className="h-4 w-4" /></Link> : null}
      </nav>
    </main>
  );
}

function withoutAuditSources(chapter: ChapterContent): PublicChapterContent {
  return JSON.parse(JSON.stringify(chapter, (key, value) => key === "sources" || key === "sourceAudit" ? undefined : value)) as PublicChapterContent;
}
