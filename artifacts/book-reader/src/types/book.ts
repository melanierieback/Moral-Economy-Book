export interface Subsection {
  slug: string;
  title: string;
  paragraphs: string[];
}

export interface Section {
  slug: string;
  title: string | null;
  paragraphs: string[];
  subsections?: Subsection[];
}

export interface Chapter {
  slug: string;
  title: string;
  sections: Section[];
}

export interface Book {
  title: string;
  subtitle: string;
  chapters: Chapter[];
}

export interface TocEntry {
  chapterSlug: string;
  chapterTitle: string;
  chapterIndex: number;
  sectionSlug: string | null;
  sectionTitle: string | null;
  sectionIndex: number | null;
}
