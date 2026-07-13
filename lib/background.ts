import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

const text = z.string().trim().min(1);
const paragraphBlock = z.object({ type: z.literal("paragraph"), text });
const subsectionBlock = z.object({
  type: z.literal("subsection"),
  title: text,
  body: z.array(text).min(1)
});
const comparisonBlock = z.object({
  type: z.literal("comparison"),
  title: text,
  headers: z.tuple([text, text, text]),
  rows: z.array(z.tuple([text, text, text])).min(1)
});
const block = z.discriminatedUnion("type", [paragraphBlock, subsectionBlock, comparisonBlock]);
const backgroundContentSchema = z.object({
  title: text,
  subtitle: text,
  sections: z.array(z.object({
    id: text,
    scope: text,
    title: text,
    blocks: z.array(block).min(1)
  })).min(1)
});

export type BackgroundContent = z.infer<typeof backgroundContentSchema>;
export type BackgroundBlock = BackgroundContent["sections"][number]["blocks"][number];

export function getBackgroundContent(): BackgroundContent {
  const path = join(process.cwd(), "content", "background.json");
  return backgroundContentSchema.parse(JSON.parse(readFileSync(path, "utf8")));
}
