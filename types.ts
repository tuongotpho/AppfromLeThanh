
export interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
  longDescription?: string;
  tags: string[];
  images: string[];
  date: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface CVData {
  fullName: string;
  title: string;
  bio: string;
  email: string;
  skills: string[];
  experience: Experience[];
}
