import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");

const INPUT = join(ROOT, "attached_assets", "Capital_That_Serves_Life_1780345238370.tex");
const OUTPUT = join(ROOT, "artifacts", "book-reader", "src", "data", "book.json");

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function convertLatexToHtml(text) {
  let result = text;

  // Remove \footnote{...} - collect content at end or just inline for simplicity
  // Inline footnotes: wrap in <span class="footnote">
  result = result.replace(/\\footnote\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (_, content) => {
    const inner = convertLatexToHtml(content);
    return `<sup class="footnote-marker">*</sup><span class="footnote-inline">${inner}</span>`;
  });

  // \emph{...} → <em>
  result = result.replace(/\\emph\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (_, content) => {
    return `<em>${convertLatexToHtml(content)}</em>`;
  });

  // \textit{...} → <em>
  result = result.replace(/\\textit\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (_, content) => {
    return `<em>${convertLatexToHtml(content)}</em>`;
  });

  // \textbf{...} → <strong>
  result = result.replace(/\\textbf\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (_, content) => {
    return `<strong>${convertLatexToHtml(content)}</strong>`;
  });

  // \textsc{...} → <span class="smallcaps">
  result = result.replace(/\\textsc\{([^{}]*)\}/g, (_, content) => {
    return `<span class="sc">${content}</span>`;
  });

  // LaTeX quotes: ``...'' → "..."
  result = result.replace(/``(.*?)''/gs, "\u201c$1\u201d");
  // Single quotes: `...' → '...'
  result = result.replace(/`(.*?)'/g, "\u2018$1\u2019");

  // Em dash: --- → —
  result = result.replace(/---/g, "\u2014");

  // En dash: -- → –
  result = result.replace(/--/g, "\u2013");

  // Escaped special chars
  result = result.replace(/\\&/g, "&amp;");
  result = result.replace(/\\%/g, "%");
  result = result.replace(/\\\$/g, "$");
  result = result.replace(/\\#/g, "#");
  result = result.replace(/\\_/g, "_");
  result = result.replace(/\\{/g, "{");
  result = result.replace(/\\}/g, "}");
  result = result.replace(/\\\^/g, "^");
  result = result.replace(/\\~/g, "~");

  // \par → paragraph break (will be handled at paragraph level)
  result = result.replace(/\\par\b/g, "\n\n");

  // \noindent → nothing
  result = result.replace(/\\noindent\b\s*/g, "");

  // \medskip, \bigskip, \smallskip, \vspace, \hspace → nothing
  result = result.replace(/\\(med|big|small)skip\b/g, "");
  result = result.replace(/\\[vh]space\*?\{[^}]*\}/g, "");

  // \newline or \\ → space
  result = result.replace(/\\\\/g, " ");
  result = result.replace(/\\newline\b/g, " ");

  // Remove remaining LaTeX commands that take no args
  result = result.replace(/\\(centering|raggedright|raggedleft|clearpage|newpage|pagebreak|linebreak)\b/g, "");

  // Remove display style commands: \large, \Large, \huge, \Huge, \small, \normalsize, etc.
  result = result.replace(/\{\\(large|Large|huge|Huge|small|normalsize|footnotesize|scriptsize|tiny|normalfont|bfseries|itshape)\s+(.*?)\}/gs, "$2");
  result = result.replace(/\\(large|Large|huge|Huge|small|normalsize|footnotesize|scriptsize|tiny|normalfont|bfseries|itshape)\b\s*/g, "");

  // Remove \label, \ref, \cite etc.
  result = result.replace(/\\(label|ref|cite|eqref|pageref)\{[^}]*\}/g, "");

  // Remove unknown commands with braces: \something{content} → content
  result = result.replace(/\\[a-zA-Z]+\{([^{}]*)\}/g, "$1");

  // Remove remaining unknown commands
  result = result.replace(/\\[a-zA-Z]+\*?\s*/g, "");

  // Trim
  result = result.trim();

  return result;
}

function parseLatex(content) {
  // Extract book title and subtitle from titlepage
  let bookTitle = "Capital That Serves Life";
  let bookSubtitle = "Recovering Moral Economy in an Age of Extraction";

  // Remove preamble (everything before \begin{document})
  let mainContent = content.replace(/^[\s\S]*?\\begin\{document\}/m, "");

  // Remove titlepage
  mainContent = mainContent.replace(/\\begin\{titlepage\}[\s\S]*?\\end\{titlepage\}/g, "");

  // Remove frontmatter, \tableofcontents, \clearpage, \mainmatter
  mainContent = mainContent.replace(/\\frontmatter\b/g, "");
  mainContent = mainContent.replace(/\\tableofcontents\b/g, "");
  mainContent = mainContent.replace(/\\mainmatter\b/g, "");
  mainContent = mainContent.replace(/\\backmatter\b/g, "");
  mainContent = mainContent.replace(/\\clearpage\b/g, "");
  mainContent = mainContent.replace(/\\pagestyle\{[^}]*\}/g, "");

  // Remove \end{document}
  mainContent = mainContent.replace(/\\end\{document\}[\s\S]*$/, "");

  // Remove \addcontentsline lines
  mainContent = mainContent.replace(/\\addcontentsline\{[^}]*\}\{[^}]*\}\{[^}]*\}\n?/g, "");

  // Remove comments
  mainContent = mainContent.replace(/(?<!\\)%[^\n]*/g, "");

  // Parse the content into chapters
  const chapters = [];

  // Split by \chapter*{...}
  const chapterPattern = /\\chapter\*\{([^}]+)\}/g;
  const chapterMatches = [...mainContent.matchAll(chapterPattern)];

  if (chapterMatches.length === 0) {
    console.error("No chapters found!");
    process.exit(1);
  }

  for (let i = 0; i < chapterMatches.length; i++) {
    const match = chapterMatches[i];
    const chapterTitle = match[1].trim();
    const chapterStart = match.index + match[0].length;
    const chapterEnd = i + 1 < chapterMatches.length ? chapterMatches[i + 1].index : mainContent.length;
    const chapterContent = mainContent.slice(chapterStart, chapterEnd);

    const normalizedChapterTitle = chapterTitle
      .replace(/---/g, "\u2014")
      .replace(/--/g, "\u2013")
      .replace(/``(.*?)''/gs, "\u201c$1\u201d")
      .replace(/`(.*?)'/g, "\u2018$1\u2019");

    const chapter = {
      slug: slugify(chapterTitle),
      title: normalizedChapterTitle,
      sections: [],
    };

    // Split chapter content into sections
    const sectionPattern = /\\section\*\{([^}]+)\}/g;
    const sectionMatches = [...chapterContent.matchAll(sectionPattern)];

    if (sectionMatches.length === 0) {
      // No sections — treat all content as a single unnamed section
      const paragraphs = extractParagraphs(chapterContent);
      if (paragraphs.length > 0) {
        chapter.sections.push({
          slug: chapter.slug + "-intro",
          title: null,
          paragraphs,
        });
      }
    } else {
      // Content before first section
      const beforeFirst = chapterContent.slice(0, sectionMatches[0].index);
      const introParagraphs = extractParagraphs(beforeFirst);
      if (introParagraphs.length > 0) {
        chapter.sections.push({
          slug: chapter.slug + "-intro",
          title: null,
          paragraphs: introParagraphs,
        });
      }

      for (let j = 0; j < sectionMatches.length; j++) {
        const sMatch = sectionMatches[j];
        const sectionTitle = sMatch[1].trim()
          .replace(/---/g, "\u2014")
          .replace(/--/g, "\u2013")
          .replace(/``(.*?)''/gs, "\u201c$1\u201d")
          .replace(/`(.*?)'/g, "\u2018$1\u2019");
        const sectionStart = sMatch.index + sMatch[0].length;
        const sectionEnd =
          j + 1 < sectionMatches.length ? sectionMatches[j + 1].index : chapterContent.length;
        const sectionContent = chapterContent.slice(sectionStart, sectionEnd);

        // Handle subsections
        const subsectionPattern = /\\subsection\*\{([^}]+)\}/g;
        const subsectionMatches = [...sectionContent.matchAll(subsectionPattern)];

        const sectionSlug = chapter.slug + "-" + slugify(sectionTitle);

        if (subsectionMatches.length === 0) {
          const paragraphs = extractParagraphs(sectionContent);
          chapter.sections.push({
            slug: sectionSlug,
            title: sectionTitle,
            paragraphs,
            subsections: [],
          });
        } else {
          const beforeFirstSub = sectionContent.slice(0, subsectionMatches[0].index);
          const sectionParas = extractParagraphs(beforeFirstSub);
          const subsections = [];

          for (let k = 0; k < subsectionMatches.length; k++) {
            const ssMatch = subsectionMatches[k];
            const ssTitle = ssMatch[1].trim();
            const ssStart = ssMatch.index + ssMatch[0].length;
            const ssEnd =
              k + 1 < subsectionMatches.length ? subsectionMatches[k + 1].index : sectionContent.length;
            const ssContent = sectionContent.slice(ssStart, ssEnd);
            subsections.push({
              slug: sectionSlug + "-" + slugify(ssTitle),
              title: ssTitle,
              paragraphs: extractParagraphs(ssContent),
            });
          }

          chapter.sections.push({
            slug: sectionSlug,
            title: sectionTitle,
            paragraphs: sectionParas,
            subsections,
          });
        }
      }
    }

    chapters.push(chapter);
  }

  return { title: bookTitle, subtitle: bookSubtitle, chapters };
}

function extractParagraphs(content) {
  // Remove block environments we don't need (like center, quote blocks)
  let cleaned = content;

  // Handle \begin{quote}...\end{quote}
  cleaned = cleaned.replace(/\\begin\{quote\}([\s\S]*?)\\end\{quote\}/g, (_, inner) => {
    return "\n\n<blockquote>" + inner.trim() + "</blockquote>\n\n";
  });

  // Remove other environments
  cleaned = cleaned.replace(/\\begin\{[^}]+\}[\s\S]*?\\end\{[^}]+\}/g, "");

  // Convert LaTeX to HTML
  cleaned = convertLatexToHtml(cleaned);

  // Split into paragraphs by double newlines
  const rawParagraphs = cleaned.split(/\n\s*\n/);

  const paragraphs = [];
  for (const para of rawParagraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("<blockquote>")) {
      paragraphs.push(trimmed);
    } else {
      // Collapse internal newlines/whitespace
      const collapsed = trimmed.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
      if (collapsed) {
        paragraphs.push(collapsed);
      }
    }
  }

  return paragraphs;
}

// Main
console.log("Reading LaTeX file...");
const content = readFileSync(INPUT, "utf-8");
console.log(`Read ${content.length} bytes`);

console.log("Parsing...");
const book = parseLatex(content);

console.log(`Parsed ${book.chapters.length} chapters`);
book.chapters.forEach((ch) => {
  console.log(`  Chapter: "${ch.title}" (${ch.sections.length} sections)`);
});

// Ensure output directory exists
mkdirSync(dirname(OUTPUT), { recursive: true });

writeFileSync(OUTPUT, JSON.stringify(book, null, 2), "utf-8");
console.log(`\nWritten to: ${OUTPUT}`);
