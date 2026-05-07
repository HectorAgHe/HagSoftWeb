/**
 * Modelos del blog HagSoft.
 */

export interface BlogTag {
  readonly id: string;
  readonly label: string;
}

export interface BlogPost {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly content: string;
  readonly author: string;
  readonly publishedAt: string;
  readonly readingTimeMin: number;
  readonly tags: readonly BlogTag[];
  readonly coverImage?: string;
}
