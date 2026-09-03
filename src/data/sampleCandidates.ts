/**
 * Nexova Recruitment Domain — Sample Candidate Data
 *
 * Realistic typed example candidates for Nexova's Recruitment Operations.
 * Used for development, demo, and testing purposes only.
 *
 * Architecture rules:
 * - Explicitly typed collection.
 * - No mutations — exported as const.
 * - No invalid examples (invalid fixtures belong to validation milestones).
 * - No filtering, searching, sorting, or aggregation logic.
 */

import type { Candidate } from "../types/models";

export const SAMPLE_CANDIDATES: readonly Candidate[] = [
  {
    id: "c001",
    full_name: "María Fernanda Lagos",
    email: "maria.lagos@email.com",
    phone: "+56 9 1234 5678",
    position: "Sales Manager B2B",
    linkedin_url: "https://linkedin.com/in/mariaflagos",
    cv_url: "https://storage.nexova.cl/cvs/c001.pdf",
    status: "received",
    stage: "pending",
    experience_years: 8,
    applied_at: "2026-08-20T10:30:00.000Z",
    updated_at: "2026-08-20T10:30:00.000Z",
    notes_count: 0,
  },
  {
    id: "c002",
    full_name: "Carlos Andrés Muñoz",
    email: "carlos.munoz@email.com",
    phone: "+56 9 2345 6789",
    position: "Customer Support Lead",
    linkedin_url: "https://linkedin.com/in/carlosamunoz",
    cv_url: "https://storage.nexova.cl/cvs/c002.pdf",
    status: "in_progress",
    stage: "review",
    experience_years: 5,
    applied_at: "2026-08-18T14:15:00.000Z",
    updated_at: "2026-08-22T09:00:00.000Z",
    notes: [
      {
        id: "n001",
        record_id: "c002",
        content: "Experiencia relevante en retail. Contactar para entrevista.",
        created_at: "2026-08-21T11:00:00.000Z",
      },
    ],
    notes_count: 1,
  },
  {
    id: "c003",
    full_name: "Valentina Paz Soto",
    email: "valentina.soto@email.com",
    phone: "+56 9 3456 7890",
    position: "Financial Analyst",
    linkedin_url: "https://linkedin.com/in/valentinasoto",
    cv_url: "https://storage.nexova.cl/cvs/c003.pdf",
    status: "in_progress",
    stage: "personal_interview",
    experience_years: 4,
    applied_at: "2026-08-15T08:00:00.000Z",
    updated_at: "2026-08-25T16:30:00.000Z",
    notes: [
      {
        id: "n002",
        record_id: "c003",
        content: "Primera entrevista realizada. Buen dominio de finanzas corporativas. Pasar a técnica.",
        created_at: "2026-08-24T10:00:00.000Z",
      },
    ],
    notes_count: 1,
  },
  {
    id: "c004",
    full_name: "Diego Alejandro Torres",
    email: "diego.torres@email.com",
    phone: "+56 9 4567 8901",
    position: "Software Engineer",
    linkedin_url: "https://linkedin.com/in/diegotorres",
    cv_url: "https://storage.nexova.cl/cvs/c004.pdf",
    status: "in_progress",
    stage: "technical_interview",
    experience_years: 6,
    applied_at: "2026-08-10T09:45:00.000Z",
    updated_at: "2026-08-28T12:00:00.000Z",
    notes: [
      {
        id: "n003",
        record_id: "c004",
        content: "Entrevista personal completada. Buen fit cultural.",
        created_at: "2026-08-20T15:00:00.000Z",
      },
      {
        id: "n004",
        record_id: "c004",
        content: "Prueba técnica enviada. Pendiente de revisión.",
        created_at: "2026-08-26T09:00:00.000Z",
      },
    ],
    notes_count: 2,
  },
  {
    id: "c005",
    full_name: "Camila Andrea Rivas",
    email: "camila.rivas@email.com",
    phone: "+56 9 5678 9012",
    position: "Marketing Manager",
    linkedin_url: "https://linkedin.com/in/camilarivas",
    cv_url: "https://storage.nexova.cl/cvs/c005.pdf",
    status: "selected",
    stage: "technical_interview",
    experience_years: 10,
    applied_at: "2026-08-01T11:00:00.000Z",
    updated_at: "2026-08-27T14:00:00.000Z",
    notes: [
      {
        id: "n005",
        record_id: "c005",
        content: "Perfil excelente. Cliente aprobó contratación.",
        created_at: "2026-08-27T14:00:00.000Z",
      },
    ],
    notes_count: 1,
  },
  {
    id: "c006",
    full_name: "Jorge Antonio Herrera",
    email: "jorge.herrera@email.com",
    phone: "+56 9 6789 0123",
    position: "IT Support Specialist",
    linkedin_url: "https://linkedin.com/in/jorgeherrera",
    cv_url: "https://storage.nexova.cl/cvs/c006.pdf",
    status: "discarded",
    stage: "review",
    experience_years: 2,
    applied_at: "2026-08-05T13:30:00.000Z",
    updated_at: "2026-08-19T08:00:00.000Z",
    notes: [
      {
        id: "n006",
        record_id: "c006",
        content: "No cumple con requisitos técnicos mínimos. Descartado.",
        created_at: "2026-08-19T08:00:00.000Z",
      },
    ],
    notes_count: 1,
  },
  {
    id: "c007",
    full_name: "Francisca Belén Martínez",
    email: "francisca.martinez@email.com",
    phone: "+56 9 7890 1234",
    position: "Business Analyst",
    linkedin_url: "https://linkedin.com/in/franciscamartinez",
    cv_url: "https://storage.nexova.cl/cvs/c007.pdf",
    status: "received",
    stage: "pending",
    experience_years: 3,
    applied_at: "2026-08-28T16:00:00.000Z",
    updated_at: "2026-08-28T16:00:00.000Z",
    notes_count: 0,
  },
] as const;