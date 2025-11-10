/**
 * Mock programático para Postagens Agendadas (PT-BR)
 *
 * - Exporta SCHEDULED_POSTS_INITIAL_DATA: array pronto para usar na dashboard.
 * - Mantém os ids originais.
 * - Gera campos relevantes para postagens:
 *   - header: título (mantive o conteúdo original com Title Case)
 *   - type: plataforma (Instagram / Facebook / X / LinkedIn / Email)
 *   - status: traduzido para PT-BR (Agendado / Publicado / Rascunho / Token expirado / Limitado / Falhou)
 *   - target: data/hora agendada (formato "YYYY-MM-DD HH:mm") — gerada a partir do id para variedade
 *   - limit: tentativas no formato "N / 3" (N calculado a partir do id)
 *   - reviewer: autor (quando não houver autor definido, será "Sem autor")
 *
 * Importação:
 * import { SCHEDULED_POSTS_INITIAL_DATA } from "data/scheduled-posts-mock";
 *
 * Use como: <DataTable data={SCHEDULED_POSTS_INITIAL_DATA} />
 */

export type RawItem = {
  id: number
  header: string
  type: string
  status: string
  target: string
  limit: string
  reviewer: string
}

/* base: sua lista limpa (title-cased / statuses normalizados) */
const RAW: RawItem[] = [
  { id: 1, header: "Cover Page", type: "Cover Page", status: "In Process", target: "18", limit: "5", reviewer: "Eddie Lake" },
  { id: 2, header: "Table Of Contents", type: "Table Of Contents", status: "Done", target: "29", limit: "24", reviewer: "Eddie Lake" },
  { id: 3, header: "Executive Summary", type: "Narrative", status: "Done", target: "10", limit: "13", reviewer: "Eddie Lake" },
  { id: 4, header: "Technical Approach", type: "Narrative", status: "Done", target: "27", limit: "23", reviewer: "Jamik Tashpulatov" },
  { id: 5, header: "Design", type: "Narrative", status: "In Process", target: "2", limit: "16", reviewer: "Jamik Tashpulatov" },
  { id: 6, header: "Capabilities", type: "Narrative", status: "In Process", target: "20", limit: "8", reviewer: "Jamik Tashpulatov" },
  { id: 7, header: "Integration With Existing Systems", type: "Narrative", status: "In Process", target: "19", limit: "21", reviewer: "Jamik Tashpulatov" },
  { id: 8, header: "Innovation And Advantages", type: "Narrative", status: "Done", target: "25", limit: "26", reviewer: "Assign Reviewer" },
  { id: 9, header: "Overview Of EMR's Innovative Solutions", type: "Technical Content", status: "Done", target: "7", limit: "23", reviewer: "Assign Reviewer" },
  { id: 10, header: "Advanced Algorithms And Machine Learning", type: "Narrative", status: "Done", target: "30", limit: "28", reviewer: "Assign Reviewer" },
  { id: 11, header: "Adaptive Communication Protocols", type: "Narrative", status: "Done", target: "9", limit: "31", reviewer: "Assign Reviewer" },
  { id: 12, header: "Advantages Over Current Technologies", type: "Narrative", status: "Done", target: "12", limit: "0", reviewer: "Assign Reviewer" },
  { id: 13, header: "Past Performance", type: "Narrative", status: "Done", target: "22", limit: "33", reviewer: "Assign Reviewer" },
  { id: 14, header: "Customer Feedback And Satisfaction Levels", type: "Narrative", status: "Done", target: "15", limit: "34", reviewer: "Assign Reviewer" },
  { id: 15, header: "Implementation Challenges And Solutions", type: "Narrative", status: "Done", target: "3", limit: "35", reviewer: "Assign Reviewer" },
  { id: 16, header: "Security Measures And Data Protection Policies", type: "Narrative", status: "In Process", target: "6", limit: "36", reviewer: "Assign Reviewer" },
  { id: 17, header: "Scalability And Future Proofing", type: "Narrative", status: "Done", target: "4", limit: "37", reviewer: "Assign Reviewer" },
  { id: 18, header: "Cost-Benefit Analysis", type: "Plain Language", status: "Done", target: "14", limit: "38", reviewer: "Assign Reviewer" },
  { id: 19, header: "User Training And Onboarding Experience", type: "Narrative", status: "Done", target: "17", limit: "39", reviewer: "Assign Reviewer" },
  { id: 20, header: "Future Development Roadmap", type: "Narrative", status: "Done", target: "11", limit: "40", reviewer: "Assign Reviewer" },
  { id: 21, header: "System Architecture Overview", type: "Technical Content", status: "In Process", target: "24", limit: "18", reviewer: "Maya Johnson" },
  { id: 22, header: "Risk Management Plan", type: "Narrative", status: "Done", target: "15", limit: "22", reviewer: "Carlos Rodriguez" },
  { id: 23, header: "Compliance Documentation", type: "Legal", status: "In Process", target: "31", limit: "27", reviewer: "Sarah Chen" },
  { id: 24, header: "API Documentation", type: "Technical Content", status: "Done", target: "8", limit: "12", reviewer: "Raj Patel" },
  { id: 25, header: "User Interface Mockups", type: "Visual", status: "In Process", target: "19", limit: "25", reviewer: "Leila Ahmadi" },
  { id: 26, header: "Database Schema", type: "Technical Content", status: "Done", target: "22", limit: "20", reviewer: "Thomas Wilson" },
  { id: 27, header: "Testing Methodology", type: "Technical Content", status: "In Process", target: "17", limit: "14", reviewer: "Assign Reviewer" },
  { id: 28, header: "Deployment Strategy", type: "Narrative", status: "Done", target: "26", limit: "30", reviewer: "Eddie Lake" },
  { id: 29, header: "Budget Breakdown", type: "Financial", status: "In Process", target: "13", limit: "16", reviewer: "Jamik Tashpulatov" },
  { id: 30, header: "Market Analysis", type: "Research", status: "Done", target: "29", limit: "32", reviewer: "Sophia Martinez" },
  { id: 31, header: "Competitor Comparison", type: "Research", status: "In Process", target: "21", limit: "19", reviewer: "Assign Reviewer" },
  { id: 32, header: "Maintenance Plan", type: "Technical Content", status: "Done", target: "16", limit: "23", reviewer: "Alex Thompson" },
  { id: 33, header: "User Personas", type: "Research", status: "In Process", target: "27", limit: "24", reviewer: "Nina Patel" },
  { id: 34, header: "Accessibility Compliance", type: "Legal", status: "Done", target: "18", limit: "21", reviewer: "Assign Reviewer" },
  { id: 35, header: "Performance Metrics", type: "Technical Content", status: "In Process", target: "23", limit: "26", reviewer: "David Kim" },
  { id: 36, header: "Disaster Recovery Plan", type: "Technical Content", status: "Done", target: "14", limit: "17", reviewer: "Jamik Tashpulatov" },
  { id: 37, header: "Third-Party Integrations", type: "Technical Content", status: "In Process", target: "25", limit: "28", reviewer: "Eddie Lake" },
  { id: 38, header: "User Feedback Summary", type: "Research", status: "Done", target: "20", limit: "15", reviewer: "Assign Reviewer" },
  { id: 39, header: "Localization Strategy", type: "Narrative", status: "In Process", target: "12", limit: "19", reviewer: "Maria Garcia" },
  { id: 40, header: "Mobile Compatibility", type: "Technical Content", status: "Done", target: "28", limit: "31", reviewer: "James Wilson" },
  { id: 41, header: "Data Migration Plan", type: "Technical Content", status: "In Process", target: "19", limit: "22", reviewer: "Assign Reviewer" },
  { id: 42, header: "Quality Assurance Protocols", type: "Technical Content", status: "Done", target: "30", limit: "33", reviewer: "Priya Singh" },
  { id: 43, header: "Stakeholder Analysis", type: "Research", status: "In Process", target: "11", limit: "14", reviewer: "Eddie Lake" },
  { id: 44, header: "Environmental Impact Assessment", type: "Research", status: "Done", target: "24", limit: "27", reviewer: "Assign Reviewer" },
  { id: 45, header: "Intellectual Property Rights", type: "Legal", status: "In Process", target: "17", limit: "20", reviewer: "Sarah Johnson" },
  { id: 46, header: "Customer Support Framework", type: "Narrative", status: "Done", target: "22", limit: "25", reviewer: "Jamik Tashpulatov" },
  { id: 47, header: "Version Control Strategy", type: "Technical Content", status: "In Process", target: "15", limit: "18", reviewer: "Assign Reviewer" },
  { id: 48, header: "Continuous Integration Pipeline", type: "Technical Content", status: "Done", target: "26", limit: "29", reviewer: "Michael Chen" },
  { id: 49, header: "Regulatory Compliance", type: "Legal", status: "In Process", target: "13", limit: "16", reviewer: "Assign Reviewer" },
  { id: 50, header: "User Authentication System", type: "Technical Content", status: "Done", target: "28", limit: "31", reviewer: "Eddie Lake" },
  { id: 51, header: "Data Analytics Framework", type: "Technical Content", status: "In Process", target: "21", limit: "24", reviewer: "Jamik Tashpulatov" },
  { id: 52, header: "Cloud Infrastructure", type: "Technical Content", status: "Done", target: "16", limit: "19", reviewer: "Assign Reviewer" },
  { id: 53, header: "Network Security Measures", type: "Technical Content", status: "In Process", target: "29", limit: "32", reviewer: "Lisa Wong" },
  { id: 54, header: "Project Timeline", type: "Planning", status: "Done", target: "14", limit: "17", reviewer: "Eddie Lake" },
  { id: 55, header: "Resource Allocation", type: "Planning", status: "In Process", target: "27", limit: "30", reviewer: "Assign Reviewer" },
  { id: 56, header: "Team Structure And Roles", type: "Planning", status: "Done", target: "20", limit: "23", reviewer: "Jamik Tashpulatov" },
  { id: 57, header: "Communication Protocols", type: "Planning", status: "In Process", target: "15", limit: "18", reviewer: "Assign Reviewer" },
  { id: 58, header: "Success Metrics", type: "Planning", status: "Done", target: "30", limit: "33", reviewer: "Eddie Lake" },
  { id: 59, header: "Internationalization Support", type: "Technical Content", status: "In Process", target: "23", limit: "26", reviewer: "Jamik Tashpulatov" },
  { id: 60, header: "Backup And Recovery Procedures", type: "Technical Content", status: "Done", target: "18", limit: "21", reviewer: "Assign Reviewer" },
  { id: 61, header: "Monitoring And Alerting System", type: "Technical Content", status: "In Process", target: "25", limit: "28", reviewer: "Daniel Park" },
  { id: 62, header: "Code Review Guidelines", type: "Technical Content", status: "Done", target: "12", limit: "15", reviewer: "Eddie Lake" },
  { id: 63, header: "Documentation Standards", type: "Technical Content", status: "In Process", target: "27", limit: "30", reviewer: "Jamik Tashpulatov" },
  { id: 64, header: "Release Management Process", type: "Planning", status: "Done", target: "22", limit: "25", reviewer: "Assign Reviewer" },
  { id: 65, header: "Feature Prioritization Matrix", type: "Planning", status: "In Process", target: "19", limit: "22", reviewer: "Emma Davis" },
  { id: 66, header: "Technical Debt Assessment", type: "Technical Content", status: "Done", target: "24", limit: "27", reviewer: "Eddie Lake" },
  { id: 67, header: "Capacity Planning", type: "Planning", status: "In Process", target: "21", limit: "24", reviewer: "Jamik Tashpulatov" },
  { id: 68, header: "Service Level Agreements", type: "Legal", status: "Done", target: "26", limit: "29", reviewer: "Assign Reviewer" },
]

/* ---------------------- Helpers ---------------------- */

const platforms = ["Instagram", "Facebook", "X", "LinkedIn", "Email"]

function toPortugueseStatus(rawStatus: string, idx: number) {
  const s = rawStatus.toLowerCase()
  if (s.includes("done")) return "Publicado"
  if (s.includes("in process") || s.includes("in progress")) return "Agendado"
  if (s.includes("token")) return "Token expirado"
  if (s.includes("limited")) return "Limitado"
  if (s.includes("failed")) return "Falha"
  if (s.includes("assign")) return "Rascunho"
  // fallback: alternate between Agendado and Rascunho for variety
  return idx % 3 === 0 ? "Agendado" : "Rascunho"
}

function titleCase(str: string) {
  return str
    .split(" ")
    .map((w) => (w.length > 0 ? w[0]!.toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(" ")
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function formatScheduleDate(baseDayOffset: number, hour: number, minute = 0) {
  // Base: Outubro 2025 (month 9 because JS Date month is 0-indexed)
  // If day exceeds month's days, Date will roll into November automatically.
  const d = new Date(Date.UTC(2025, 9, 28 + baseDayOffset, hour, minute, 0))
  // Return in "YYYY-MM-DD HH:mm" local-like string (no timezone)
  const year = d.getUTCFullYear()
  const month = pad(d.getUTCMonth() + 1)
  const day = pad(d.getUTCDate())
  const hh = pad(d.getUTCHours())
  const mm = pad(d.getUTCMinutes())
  return `${year}-${month}-${day} ${hh}:${mm}`
}

/* ---------------------- Gerar array de postagens agendadas em PT-BR ---------------------- */
export const SCHEDULED_POSTS_INITIAL_DATA = RAW.map((item, idx) => {
  // choose platform based on index for variety
  const plataforma = platforms[idx % platforms.length]

  // target: generate upcoming dates with some spread
  const baseDayOffset = idx % 8 // 0..7 => days 28..35 (rolls into nov as needed)
  const hour = 8 + (idx % 8) // 8..15
  const scheduled = toPortugueseStatus(item.status, idx) === "Rascunho" ? "Rascunho" : formatScheduleDate(baseDayOffset, hour)

  // attempts: use id % 4 as attempts used, max = 3 (most posts allow 3 tentativas)
  const attemptsUsed = idx % 4
  const maxAttempts = attemptsUsed === 3 ? 3 : 3
  const attempts = `${attemptsUsed} / ${maxAttempts}`

  // reviewer: keep real names, "Assign Reviewer" -> "Sem autor"
  const rawReviewer = item.reviewer || ""
  const reviewer = rawReviewer.toLowerCase().includes("assign") ? "Sem autor" : titleCase(rawReviewer)

  return {
    id: item.id,
    header: titleCase(item.header),
    type: plataforma,
    status: toPortugueseStatus(item.status, idx),
    target: scheduled,
    limit: attempts,
    reviewer,
  }
})

export type ISCHEDULED_POSTS_INITIAL_DATA = typeof SCHEDULED_POSTS_INITIAL_DATA
/* ---------------------- Exemplo rápido de uso (comentado)
import { SCHEDULED_POSTS_INITIAL_DATA } from "data/scheduled-posts-mock";
<DataTable data={SCHEDULED_POSTS_INITIAL_DATA} />
*/
