export interface ILab {
  id: string;
  name: string;
  universityId: string;
  focusAreas: string[];
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  university?: {
    id: string;
    name: string;
    country: string;
    imageUrl?: string | null;
  };
}

export interface ICreateLabPayload {
  name: string;
  universityId: string;
  focusAreas?: string[];
  imageUrl?: string;
}

export interface IUpdateLabPayload {
  name?: string;
  focusAreas?: string[];
  imageUrl?: string;
}

export interface IUpdateLabParams {
  id: string;
  payload: IUpdateLabPayload;
}

export interface ILabFilters {
  searchTerm?: string;
  universityId?: string;
  focusArea?: string;
}
