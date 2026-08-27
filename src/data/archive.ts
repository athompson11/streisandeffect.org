import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

export type DocumentStatus = 'available' | 'needs-metadata' | 'disputed' | 'temporarily-disabled';

export interface SourceLink {
  label: string;
  url: string;
  type?: string;
  note?: string;
}

export interface TimelineEvent {
  date: string;
  label: string;
  description: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface ExternalResponse {
  label: string;
  description: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface ArchiveDocument {
  slug: string;
  title: string;
  status: DocumentStatus;
  publisher: string;
  publicationDate?: string;
  bestKnownPublicationDate?: string;
  publisherStatus: string;
  archiveStatus: string;
  removalStatus: string;
  removalDiscoveredDate?: string;
  archiveObtainedDate: string;
  copyObtainedHow: string;
  originalUrl?: string;
  originalUrlNote?: string;
  archivedOriginalUrl?: string;
  archivedOriginalUrlNote?: string;
  summary: string;
  neutralDescription: string;
  publisherCurrentPosition: string;
  whyHosted: string;
  fileName: string;
  fileType: string;
  pageCount: number;
  fileSizeBytes: number;
  sha256: string;
  primaryDownloadUrl: string;
  mirrorUrls: string[];
  contentWarnings: string[];
  lastReviewed: string;
  sources: SourceLink[];
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
  lastReviewed: string;
  publisherStatus: string;
  archiveStatus: string;
  sources: SourceLink[];
  verifiedEvents: TimelineEvent[];
  amnestyPosition: string;
  criticsStatements: ExternalResponse[];
  archiveInterpretation: string;
  documents: ArchiveDocument[];
}

function toCamel(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toCamel);
  if (!value || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, nested]) => [key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()), toCamel(nested)])
  );
}

function normalizeDocument(document: unknown): ArchiveDocument {
  const parsed = document as Partial<ArchiveDocument>;
  return {
    ...parsed,
    status: parsed.status ?? 'available',
    mirrorUrls: parsed.mirrorUrls ?? [],
    contentWarnings: parsed.contentWarnings ?? [],
    sources: parsed.sources ?? []
  } as ArchiveDocument;
}

function loadCollections(): ArchiveCollection[] {
  const archivePath = join(process.cwd(), 'content', 'collections', 'amnestyinternational', 'archive.yaml');
  const raw = YAML.parse(readFileSync(archivePath, 'utf8')) as Record<string, unknown>;
  const collection = toCamel(raw) as ArchiveCollection;
  collection.documents = (collection.documents ?? []).map((document) => normalizeDocument(document));
  collection.sources = collection.sources ?? [];
  collection.verifiedEvents = collection.verifiedEvents ?? [];
  collection.criticsStatements = collection.criticsStatements ?? [];
  collection.topics = collection.topics ?? [];
  return [collection];
}

export const archiveCollections: ArchiveCollection[] = loadCollections();

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
  if (bytes === undefined) return 'Not listed';
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
      return 'Preserved copy available';
    case 'needs-metadata':
      return 'Needs metadata';
    case 'disputed':
      return 'Disputed';
    case 'temporarily-disabled':
      return 'Temporarily disabled';
  }
}
