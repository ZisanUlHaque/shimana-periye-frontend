export interface IProfessor {
  id: string;
  name: string;
  email?: string | null;
  universityId: string;
  labId?: string | null;
  researchAreas: string[];
  createdAt: string;
  updatedAt: string;
  university?: {
    id: string;
    name: string;
    country: string;
  };
  lab?: {
    id: string;
    name: string;
  } | null;
}

export interface ICreateProfessorPayload {
  name: string;
  email?: string;
  universityId: string;
  labId?: string;
  researchAreas?: string[];
}

export interface IUpdateProfessorPayload {
  name?: string;
  email?: string;
  labId?: string | null;
  researchAreas?: string[];
}

export interface IUpdateProfessorParams {
  id: string;
  payload: IUpdateProfessorPayload;
}

export interface IProfessorFilters {
  searchTerm?: string;
  universityId?: string;
  labId?: string;
  researchArea?: string;
}
