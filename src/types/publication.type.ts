export interface IPublication {
  id: string;
  studentProfileId: string;
  title: string;
  venue?: string | null;
  year?: number | null;
  paperId?: string | null;
  doi?: string | null;
  link?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePublicationPayload {
  title: string;
  venue?: string;
  year?: number;
  paperId?: string;
  doi?: string;
  link?: string;
}

export type IUpdatePublicationPayload = Partial<ICreatePublicationPayload>;

export interface IUpdatePublicationParams {
  id: string;
  payload: IUpdatePublicationPayload;
}
