export type DocumentStatus = 'available' | 'pending' | 'disputed' | 'temporarily-disabled';

export interface ArchiveDocument {
  slug: string;
  title: string;
  status: DocumentStatus;
  publisher: string;
  publicationDate?: string;
  originalUrl?: string;
  archivedOriginalUrl?: string;
  removalDiscoveredDate?: string;
  summary: string;
  whyHosted: string;
  fileName?: string;
  fileType?: string;
  fileSizeBytes?: number;
  sha256?: string;
  primaryDownloadUrl?: string;
  mirrorUrls?: string[];
  warnings: string[];
}

export interface ArchiveCollection {
  slug: string;
  title: string;
  shortTitle: string;
  publisher: string;
  status: 'active' | 'draft';
  summary: string;
  contentWarning?: string;
  editorialNote: string;
  topics: string[];
  archiveStarted: string;
  documents: ArchiveDocument[];
  contextLinks: Array<{
    label: string;
    url: string;
    note?: string;
  }>;
}

export const archiveCollections: ArchiveCollection[] = [
  {
    slug: 'amnestyinternational',
    title: 'Amnesty International Anti-Trans Reports Archive',
    shortTitle: 'Amnesty International',
    publisher: 'Amnesty International',
    status: 'active',
    summary:
      'A public-interest archive for Amnesty International reports or materials that have been criticized as anti-trans and later removed, hidden, or made difficult to access.',
    contentWarning:
      'This collection may include anti-trans claims, framing, or policy arguments. Hosting preserves the public record and does not imply endorsement.',
    editorialNote:
      'This archive preserves materials for accountability, criticism, historical record, and research. It should distinguish original publication facts from editorial criticism and should link to relevant rebuttals or expert context when available.',
    topics: ['trans rights', 'human rights organizations', 'public accountability', 'deleted documents'],
    archiveStarted: '2026-08-26',
    documents: [],
    contextLinks: []
  }
];

export function getCollections(): ArchiveCollection[] {
  return archiveCollections;
}

export function getCollection(slug: string): ArchiveCollection | undefined {
  return archiveCollections.find((collection) => collection.slug === slug);
}

export function getDocument(collectionSlug: string, documentSlug: string): ArchiveDocument | undefined {
  return getCollection(collectionSlug)?.documents.find((document) => document.slug === documentSlug);
}

export function formatBytes(bytes?: number): string {
  if (bytes === undefined) return 'Pending';
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function hasDownloads(document: ArchiveDocument): boolean {
  return Boolean(document.primaryDownloadUrl || document.mirrorUrls?.length);
}

export function documentStatusLabel(status: DocumentStatus): string {
  switch (status) {
    case 'available':
      return 'Available';
    case 'pending':
      return 'Metadata pending';
    case 'disputed':
      return 'Disputed';
    case 'temporarily-disabled':
      return 'Temporarily disabled';
  }
}
