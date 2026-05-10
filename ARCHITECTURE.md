# Architecture Overview

## Frontend

The frontend is built using Next.js App Router with React and Tailwind CSS.

Main responsibilities:
- Multi-tool audit UI
- Dynamic report generation
- Public report rendering
- AI summary display
- Lead capture

## Backend

Supabase is used as the backend service.

Responsibilities:
- Audit storage
- Lead storage
- Public report retrieval

## Database Tables

### audits
Stores generated audits and savings data.

### leads
Stores user lead information.

## AI Layer

OpenAI API generates intelligent summaries for each audit.

## Routing

Dynamic route:
`/audit/[id]`

Used for public shareable reports.

## Deployment

Hosted on Vercel with environment variables configured securely.