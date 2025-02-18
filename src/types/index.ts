export interface BaseEntity {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Experience extends BaseEntity {
  position: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string;
  technologies: string[];
}

export interface Project extends BaseEntity {
  title: string;
  description: string;
  technologies: string[];
  image_url?: string;
  demo_url?: string;
  github_url?: string;
}

export interface Skill extends BaseEntity {
  user_id: string;
  name: string;
  category: string;
  proficiency: number;
}

export interface Certificate extends BaseEntity {
  title: string;
  provider: string;
  issue_date: string;
  credential_url: string | null;
  image_url: string | null;
}

export type CreateEntityInput<T extends BaseEntity> = Omit<T, keyof BaseEntity>;
export type UpdateEntityInput<T extends BaseEntity> = Partial<
  CreateEntityInput<T>
>;
