import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

/**
 * SeoService
 * Gestiona meta tags dinámicos para SSR (title, description, OpenGraph, canonical).
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  /** Aplica un set completo de meta tags. */
  apply(seo: SeoMeta): void {
    const fullTitle = `${seo.title} | HagSoft`;
    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:type', content: seo.type ?? 'website' });

    if (seo.image) {
      this.meta.updateTag({ property: 'og:image', content: seo.image });
    }
    if (seo.url) {
      this.meta.updateTag({ property: 'og:url', content: seo.url });
      this.setCanonical(seo.url);
    }
  }

  /** Actualiza el <link rel="canonical">. */
  setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
