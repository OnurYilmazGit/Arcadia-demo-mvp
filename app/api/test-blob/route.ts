import { NextResponse } from "next/server"

const VERCEL_BLOB_BASE_URL = "https://gsm9wndtt34brfr2.public.blob.vercel-storage.com/candidate_cv"

const TEST_FILES = [
  "Candidate_A1_AI_ML_Engineer_Final.docx",
  "candidate_a5.docx",
  "candidate_a4.pdf",
  "candidate_a3.pdf",
  "dataeng_candidate_a1.pdf",
]

export async function GET() {
  const results = []

  for (const fileName of TEST_FILES) {
    try {
      const url = `${VERCEL_BLOB_BASE_URL}/${fileName}`
      const response = await fetch(url, { method: "HEAD" })

      results.push({
        fileName,
        url,
        exists: response.ok,
        status: response.status,
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
      })
    } catch (error) {
      results.push({
        fileName,
        url: `${VERCEL_BLOB_BASE_URL}/${fileName}`,
        exists: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return NextResponse.json({
    baseUrl: VERCEL_BLOB_BASE_URL,
    testResults: results,
    timestamp: new Date().toISOString(),
  })
}
