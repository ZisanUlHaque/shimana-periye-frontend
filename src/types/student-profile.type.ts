export interface IStudentProfile {
  id: string;
  userId: string;
  interests: string[];
  skills: string[];
  createdAt: string;
  updatedAt: string;
  academics?: any[];
  publications?: any[];
  experiences?: any[];
  user?: {
    id: string;
    name: string;
    email: string;
    imageUrl?: string | null;
  };
}

export interface IUpdateStudentProfilePayload {
  interests?: string[];
  skills?: string[];
}

export interface ICompletenessCategory {
  score: number;
  max: number;
  done: boolean;
}

export interface IProfileCompleteness {
  percentage: number;
  breakdown: {
    academics: ICompletenessCategory;
    interestsAndSkills: ICompletenessCategory;
    documents: ICompletenessCategory;
    tests: ICompletenessCategory;
    publications: ICompletenessCategory;
  };
}
