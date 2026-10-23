export type DocumentType =
  | "SOP"
  | "CV"
  | "RESEARCH_STATEMENT"
  | "TRANSCRIPT"
  | "OTHER";

export type ReviewStatus = "DRAFT" | "SUBMITTED" | "REVIEWED" | "APPROVED";

export interface IDocumentComment {
  id: string;
  documentVersionId: string;
  mentorId: string;
  comment: string;
  createdAt: string;
  mentor?: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string | null;
  };
}

export interface IDocumentVersion {
  id: string;
  documentId: string;
  versionNo: number;
  fileUrl: string;
  filePublicId: string;
  fileSize?: number | null;
  mimeType?: string | null;
  reviewStatus: ReviewStatus;
  uploadedAt: string;
  comments?: IDocumentComment[];
}

export interface IDocument {
  id: string;
  studentProfileId: string;
  applicationId?: string | null;
  type: DocumentType;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  versions: IDocumentVersion[];
  application?: {
    id: string;
    opportunity?: {
      id: string;
      title: string;
    };
  } | null;
}

export interface ICreateDocumentPayload {
  type: DocumentType;
  applicationId?: string;
  file: File;
}

export interface IUpdateDocumentPayload {
  type?: DocumentType;
  applicationId?: string | null;
}

export interface IUpdateDocumentParams {
  id: string;
  payload: IUpdateDocumentPayload;
}

export interface IAddNewVersionPayload {
  documentId: string;
  file: File;
}

export interface IAiFeedbackResult {
  score?: number;
  feedback: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}
