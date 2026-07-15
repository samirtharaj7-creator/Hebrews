import { readFileSync } from "node:fs";
import { collectPublicText, collectStringLeaves, commentaryFor, loadHebrews } from "./hebrews-content-utils.mjs";

const chapters = loadHebrews();
const errors = [];
let reviewed = 0;
const allowPendingReview = process.argv.includes("--allow-pending-review");

for (const { content } of chapters) {
  for (const verse of content.verses) {
    if (verse.reviewStatus === "verified-seed") {
      reviewed += 1;
    } else if (!allowPendingReview || verse.reviewStatus !== "needs-source-review") {
      const expected = allowPendingReview ? "verified-seed or needs-source-review" : "verified-seed";
      errors.push(`${verse.verse}: expected reviewStatus ${expected}, found ${verse.reviewStatus}`);
    }
  }
}

const prohibitedPublicPatterns = [
  [/\bAdventist\b/i, "denominational label"],
  [/General Conference/i, "General Conference attribution"],
  [/Biblical Research Institute/i, "Biblical Research Institute attribution"],
  [/\bBRI\b/, "BRI attribution"],
  [/White Estate|Ellen G\.? White/i, "White Estate attribution"],
  [/\bPaul(?:['’]s)?\s+(?:writes?|says?|argues?|teaches?|declares?|commands?|warns?|urges?|explains?|presents?|describes?|argument|exhortation|warning|command|appeal|contrast|language|words?)\b/i, "unqualified Pauline authorship"],
  [/https?:\/\/|\bwww\./i, "public URL"],
  [/\bin this reconstruction\b/i, "reconstruction language"],
  [/the interpretation represented here/i, "interpretive-process language"],
  [/\bour tradition\b/i, "tradition attribution"],
  [/this study (?:concludes|shows|argues)/i, "research-process language"],
  [/according to (?:our|the) (?:source|sources|research)/i, "source attribution"]
];

const backgroundPath = "content/background.json";
const background = JSON.parse(readFileSync(backgroundPath, "utf8"));
const publicText = [
  ...collectPublicText(chapters),
  ...collectStringLeaves(background, backgroundPath)
];

for (const { field, value } of publicText) {
  for (const [pattern, label] of prohibitedPublicPatterns) {
    if (pattern.test(value)) errors.push(`${field}: contains ${label}`);
  }
}

const assertions = [
  { reference: "Hebrews 1:6", patterns: [/incarnat|human family/is, /worship/is] },
  { reference: "Hebrews 1:8", patterns: [/fully divine|divine identity|(?:called|addressed).*God/is, /eternal|everlasting/is] },
  { reference: "Hebrews 2:5", patterns: [/world to come/is, /Second Advent|future kingdom/is] },
  { reference: "Hebrews 2:14", patterns: [/devil/is, /death/is, /resurrection|rose|risen/is] },
  { reference: "Hebrews 4:9", patterns: [/rest of grace/is, /Sabbath[^.!?]{0,160}creat|creat[^.!?]{0,160}Sabbath/is] },
  { reference: "Hebrews 4:9", patterns: [/Sabbath/is, /seventh day/is, /remain|continues/is] },
  { reference: "Hebrews 6:4", patterns: [/apostasy|repudiat|falling away/is, /repent|return|seeking/is] },
  { reference: "Hebrews 6:19", patterns: [/veil/is, /not[^.!?]{0,180}(?:decide|settle)|should not be forced[^.!?]{0,180}(?:phase|apartment)/is] },
  { reference: "Hebrews 7:3", patterns: [/genealog|record/is, /type|pattern|resembl/is] },
  { reference: "Hebrews 7:12", patterns: [/Levitical|priesthood/is, /(?:not|nothing)[^.!?]{0,120}(?:cancel|abolish)[^.!?]{0,80}(?:moral law|Sabbath)|(?:moral law|Sabbath)[^.!?]{0,100}(?:remain|continues|not[^.!?]*(?:cancel|abolish))/is] },
  { reference: "Hebrews 8:2", patterns: [/plural in form|Greek[^.!?]{0,120}plural/is, /grammar alone[^.!?]{0,120}does not decide/is] },
  { reference: "Hebrews 8:10", patterns: [/law/is, /heart/is, /mind/is] },
  { reference: "Hebrews 8:13", patterns: [/Christ.s death|cross/is, /transition[^.!?]{0,100}gradual|gradual[^.!?]{0,100}transition/is] },
  { reference: "Hebrews 8:13", patterns: [/covenant|administration/is, /(?:not|nothing)[^.!?]{0,140}(?:moral law|Ten Commandments|Sabbath)|(?:moral law|Ten Commandments|Sabbath)[^.!?]{0,120}(?:remain|continues|not[^.!?]*(?:obsolete|abolish))/is] },
  { reference: "Hebrews 9:12", patterns: [/once/is, /heavenly sanctuary|heavenly ministry/is] },
  { reference: "Hebrews 9:23", patterns: [/1844/is, /judgment/is, /once for all/is] },
  { reference: "Hebrews 9:23", patterns: [/heavenly/is, /cleans|purif/is] },
  { reference: "Hebrews 9:27", patterns: [/unconscious|sleep/is, /not[^.!?]{0,100}naturally immortal|do not possess immortality by nature/is, /no support for purgatory|does not support purgatory/is, /judgment/is] },
  { reference: "Hebrews 10:1", patterns: [/sanctuary|sacrificial/is, /not[^.!?]{0,120}(?:abolition|abolish|discard)[^.!?]{0,60}moral law|moral law[^.!?]{0,100}(?:not[^.!?]*(?:abolish|discard)|remain|continues)/is] },
  { reference: "Hebrews 10:5", patterns: [/preexist/is, /embodied mission|prepared body/is] },
  { reference: "Hebrews 10:14", patterns: [/present participle/is, /need not[^.!?]{0,100}define every stage|finished offering|finished provision/is] },
  { reference: "Hebrews 10:25", patterns: [/Jerusalem.s destruction|A\.D\. 70/is, /chiefly[^.!?]{0,100}Christ.s return|Second Advent/is] },
  { reference: "Hebrews 10:26", patterns: [/settled|deliberate|repudiat/is, /repent|struggl|tempt/is] },
  { reference: "Hebrews 10:27", patterns: [/consume|devour|destroy|remove/is] },
  { reference: "Hebrews 11:13", patterns: [/died/is, /resurrection|future|still looking/is] },
  { reference: "Hebrews 11:27", patterns: [/Midian/is, /fear/is] },
  { reference: "Hebrews 11:40", patterns: [/resurrection/is, /together|whole.*family|every generation/is] },
  { reference: "Hebrews 12:1", patterns: [/testimony|testif/is, /not.*conscious|need not mean.*observ/is] },
  { reference: "Hebrews 12:23", patterns: [/need not describe[^.!?]{0,100}(?:immortal|conscious)|not[^.!?]{0,100}(?:immortal|conscious)|resting unconsciously/is, /resurrection|Hebrews 11/is] },
  { reference: "Hebrews 12:28", patterns: [/thankful|grateful|gratitude/is] },
  { reference: "Hebrews 12:29", patterns: [/remove|destroy|consume/is, /not preserve rebellion|not.*forever/is] },
  { reference: "Hebrews 13:9", patterns: [/clean and unclean/is, /not under discussion|does not abolish/is] },
  { reference: "Hebrews 13:10", patterns: [/not.*repeated|once for all/is] },
  { reference: "Hebrews 13:17", patterns: [/not.*unlimited|blind obedience|authoritarian/is, /account/is] }
];

for (const { reference, patterns } of assertions) {
  const commentary = commentaryFor(reference, chapters);
  for (const pattern of patterns) {
    if (!pattern.test(commentary)) errors.push(`${reference}: missing theological safeguard ${pattern}`);
  }
}

if (!allowPendingReview && reviewed !== 303) errors.push(`Expected 303 verified notes, found ${reviewed}`);

if (errors.length) {
  console.error(`Theological validation failed with ${errors.length} error(s):\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exit(1);
}

console.log(
  allowPendingReview
    ? `Theological content validation passed: ${assertions.length} targeted doctrinal controls; review-status gate deferred.`
    : `Theological validation passed: ${reviewed} verified notes and ${assertions.length} targeted doctrinal controls.`
);
