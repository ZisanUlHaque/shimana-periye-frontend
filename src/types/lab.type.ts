export interface ILab {
  id: string;
  name: string;
  universityId: string;
  focusAreas: string[];
  createdAt: string;
  updatedAt: string;
  university?: {
    id: string;
    name: string;
    country: string;
  };
}

export interface ICreateLabPayload {
  name: string;
  universityId: string;
  focusAreas?: string[];
}

export interface IUpdateLabPayload {
  name?: string;
  focusAreas?: string[];
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
