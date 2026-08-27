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
    title: 'Amnesty International UK Anti-Rights Movement Reports Archive',
    shortTitle: 'Amnesty International UK',
    publisher: 'Amnesty International UK',
    status: 'active',
    summary:
      'A pro-trans public-interest archive for Amnesty International UK briefings on anti-rights and gender-critical movements in the UK, preserved because pressure from the gender-critical crowd should not be allowed to censor accountability documents.',
    contentWarning:
      'This collection discusses anti-trans organizing, gender-critical political advocacy, and threats to the rights of women and LGBT+ people. The archive is explicitly pro-trans and preserves these documents so attempts to suppress criticism of anti-trans politics do not erase the public record.',
    editorialNote:
      'These reports are preserved for accountability, criticism, historical record, and research after becoming candidates for preservation because of public controversy and pressure from gender-critical actors, including reported legal threats. The archive stands with trans people and against censorship campaigns that try to make pro-trans accountability documents disappear.',
    topics: ['trans rights', 'pro-trans accountability', 'anti-rights movements', 'gender-critical pressure', 'public accountability'],
    archiveStarted: '2026-08-26',
    documents: [
      {
        slug: 'a-growing-threat-the-anti-rights-movement-in-the-uk-july-2026',
        title: 'A growing threat: the anti-rights movement in the UK',
        status: 'available',
        publisher: 'Amnesty International UK',
        publicationDate: 'July 2026',
        summary:
          'A 22-page Amnesty International UK briefing describing the UK anti-rights ecosystem, including anti-rights organizations, funding patterns, and links between gender-critical actors and broader attacks on the rights of women and LGBT+ people.',
        whyHosted:
          'Preserved because this report is part of the public record around UK anti-rights organizing and because pressure from the gender-critical crowd, including reported legal threats, should not be allowed to censor documents that condemn anti-trans politics. The archive hosts it from a pro-trans position for public-interest research, accountability, and criticism.',
        fileName: 'a-growing-threat-the-anti-rights-movement-in-the-uk-july-2026.pdf',
        fileType: 'application/pdf',
        fileSizeBytes: 353758,
        sha256: 'd11534aa4fccdf0e19a4390b94586ec8ec23fbbac842acf03961bdbdf97cf387',
        primaryDownloadUrl:
          '/documents/amnestyinternational/a-growing-threat-the-anti-rights-movement-in-the-uk-july-2026.pdf',
        mirrorUrls: [],
        warnings: ['anti-trans organizing', 'anti-rights movement analysis', 'legal-pressure context pending citation']
      },
      {
        slug: 'like-a-snowball-the-growth-and-impact-of-the-gender-critical-movement-in-the-uk-may-2026',
        title: 'Like a snowball: the growth and impact of the gender critical movement in the UK',
        status: 'available',
        publisher: 'Amnesty International UK',
        publicationDate: 'May 2026',
        summary:
          'A 25-page Amnesty International UK briefing examining gender-critical actors in the UK, media coverage of trans people, and the movement’s relationship to wider anti-rights advocacy.',
        whyHosted:
          'Preserved because it documents a politically significant anti-trans movement affecting the rights and public treatment of trans people in the UK. The archive hosts it from a pro-trans position for public-interest research, accountability, and criticism, and to resist pressure campaigns that try to make criticism of gender-critical politics harder to find.',
        fileName: 'like-a-snowball-the-growth-and-impact-of-the-gender-critical-movement-in-the-uk-may-2026.pdf',
        fileType: 'application/pdf',
        fileSizeBytes: 411751,
        sha256: 'f77a5315df3fa0204045d1d7ae2483ab57c075ea95674e96595edf3526144e5f',
        primaryDownloadUrl:
          '/documents/amnestyinternational/like-a-snowball-the-growth-and-impact-of-the-gender-critical-movement-in-the-uk-may-2026.pdf',
        mirrorUrls: [],
        warnings: ['anti-trans organizing', 'gender-critical movement analysis']
      }
    ],
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
