export type ContextOption = {
  id: string;
  label: string;
  translations: Record<string, string>;
};

export type ContentType = 'prayer' | 'verses' | 'both';
export type PrayerSize = 'small' | 'medium' | 'large';

export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export type PrayerResult = {
  prayer?: string;
  verses?: {
    text: string;
    reference: string;
  }[];
  context: string;
  contentType: ContentType;
  prayerSize?: PrayerSize;
  timestamp: number;
};

export type Translations = {
  siteTitle: string;
  subtitle: string;
  contextSectionTitle: string;
  customContextLabel: string;
  customContextPlaceholder: string;
  contentTypeLabel: string;
  prayerOption: string;
  versesOption: string;
  bothOption: string;
  generateButton: string;
  loadingMessage: string;
  shareButton: string;
  downloadButton: string;
  backButton: string;
  prayerSectionTitle: string;
  versesSectionTitle: string;
  limitReachedMessage: string;
  remainingTitle: string;
  limitReachedTitle: string;
};
