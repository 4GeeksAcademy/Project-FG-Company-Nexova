import type {
  Candidate,
  CandidateStage,
  CandidateStatus,
  CreateCandidatePayload,
  CreateNotePayload,
  Note,
  NotesResponse,
  PaginatedResponse,
  PatchCandidatePayload,
  UpdateCandidatePayload,
} from "@/types/candidate";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClientError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`API request failed with status ${status}`);
    this.name = "ApiClientError";
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    throw new ApiClientError(res.status, body);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// ── Records ──────────────────────────────────────────────────────

export interface GetRecordsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CandidateStatus;
  stage?: CandidateStage;
}

export async function getRecords(
  params: GetRecordsParams = {}
): Promise<PaginatedResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.stage) query.set("stage", params.stage);
  return request<PaginatedResponse>(`/records?${query.toString()}`);
}

export async function getRecord(id: string): Promise<Candidate> {
  return request<Candidate>(`/records/${id}`);
}

export async function createRecord(
  payload: CreateCandidatePayload
): Promise<Candidate> {
  return request<Candidate>("/records", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateRecord(
  id: string,
  payload: UpdateCandidatePayload
): Promise<Candidate> {
  return request<Candidate>(`/records/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function patchRecord(
  id: string,
  payload: PatchCandidatePayload
): Promise<Candidate> {
  return request<Candidate>(`/records/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// ── Notes ────────────────────────────────────────────────────────

export async function getNotes(recordId: string): Promise<NotesResponse> {
  return request<NotesResponse>(`/records/${recordId}/notes`);
}

export async function createNote(
  recordId: string,
  payload: CreateNotePayload
): Promise<Note> {
  return request<Note>(`/records/${recordId}/notes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteNote(
  recordId: string,
  noteId: string
): Promise<void> {
  return request<void>(`/records/${recordId}/notes/${noteId}`, {
    method: "DELETE",
  });
}

export { ApiClientError };