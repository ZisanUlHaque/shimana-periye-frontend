export interface IUniversity {
  id: string;
  name: string;
  country: string;
  website?: string | null;
  imageUrl?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUniversityProfessorSummary {
  id: string;
  name: string;
  email?: string | null;
}

export interface IUniversityLabSummary {
  id: string;
  name: string;
}

export interface IUniversityDetail extends IUniversity {
  professors?: IUniversityProfessorSummary[];
  labs?: IUniversityLabSummary[];
}

export interface ICreateUniversityPayload {
  name: string;
  country: string;
  website?: string;
  imageUrl?: string;
}

export interface IUpdateUniversityPayload {
  name?: string;
  country?: string;
  website?: string;
  imageUrl?: string;
}

export interface IUniversityFilters {
  searchTerm?: string;
  country?: string;
}

export interface IUniversityListParams extends IUniversityFilters {
  page?: number;
  limit?: number;
}
