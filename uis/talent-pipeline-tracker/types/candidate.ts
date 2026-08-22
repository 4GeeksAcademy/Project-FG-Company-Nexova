export type CandidateStatus = "received" | "in_progress" | "discarded";

export type CandidateStage = "pending" | "review" | "personal_interview";

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string;
  cv_url: string;
  status: CandidateStatus;
  stage: CandidateStage;
  experience_years: number;
  applied_at: string;
  updated_at: string;
  notes?: Note[];
  notes_count: number;
}

export interface Note {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
}

export interface NotesResponse {
  data: Note[];
  meta: {
    total: number;
  };
}

export interface PaginatedResponse {
  total: number;
  page: number;
  limit: number;
  data: Candidate[];
}

export interface CreateCandidatePayload {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: number;
}

export type UpdateCandidatePayload = CreateCandidatePayload;

export interface PatchCandidatePayload {
  status?: CandidateStatus;
  stage?: CandidateStage;
}

export interface CreateNotePayload {
  content: string;
}

export interface ApiError {
  detail?: string | Array<{
    type: string;
    loc: string[];
    msg: string;
    input: unknown;
    url: string;
  }>;
  error?: string;
}