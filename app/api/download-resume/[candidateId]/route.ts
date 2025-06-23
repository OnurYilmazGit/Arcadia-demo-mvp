import { type NextRequest, NextResponse } from "next/server"

// Vercel Blob Storage configuration
const VERCEL_BLOB_BASE_URL = "https://gsm9wndtt34brfr2.public.blob.vercel-storage.com/candidate_cv"

// Mapping of candidate IDs to their actual file names in Vercel Blob Storage
const CANDIDATE_FILE_MAPPING: Record<string, string> = {
  // AI/ML Engineers
  candidate_a1: "Candidate_A1_AI_ML_Engineer_Final",
  candidate_a2: "Candidate_A2_AI_ML_Engineer_Fintech",
  candidate_a3: "candidate_a3",
  candidate_a4: "candidate_a4",
  candidate_a5: "candidate_a5",
  candidate_a6: "candidate_a6",

  // Data Engineers
  dataeng_candidate_a1: "dataeng_candidate_a1",
  dataeng_candidate_a2: "dataeng_candidate_a2",
  dataeng_candidate_a3: "dataeng_candidate_a3",
  dataeng_candidate_a4: "dataeng_candidate_a4",
  dataeng_candidate_a5: "dataeng_candidate_a5",
  dataeng_candidate_a6: "dataeng_candidate_a6",

  // DevOps Engineers
  devops_candidate_a1: "devops_candidate_a1",
  devops_candidate_a2: "devops_candidate_a2",
  devops_candidate_a3: "devops_candidate_a3",
  devops_candidate_a4: "devops_candidate_a4",
  devops_candidate_a5: "devops_candidate_a5",
  devops_candidate_a6: "devops_candidate_a6",

  // Embedded Engineers
  embedded_candidate_a1: "embedded_candidate_a1",
  embedded_candidate_a2: "embedded_candidate_a2",
  embedded_candidate_a3: "embedded_candidate_a3",
  embedded_candidate_a4: "embedded_candidate_a4",
  embedded_candidate_a5: "embedded_candidate_a5",
  embedded_candidate_a6: "embedded_candidate_a6",

  // Full Stack Engineers
  full_stack_candidate_a1: "full_stack_candidate_a1",
  full_stack_candidate_a2: "full_stack_candidate_a2",
  full_stack_candidate_a3: "full_stack_candidate_a3",
  full_stack_candidate_a4: "full_stack_candidate_a4",
  full_stack_candidate_a5: "full_stack_candidate_a5",
  full_stack_candidate_a6: "full_stack_candidate_a6",

  // Security Engineers
  security_candidate_a1: "security_candidate_a1",
  security_candidate_a2: "security_candidate_a2",
  security_candidate_a3: "security_candidate_a3",
}

async function fetchFromVercelBlob(fileName: string): Promise<{
  buffer: ArrayBuffer
  contentType: string
  fileExtension: string
  originalUrl: string
} | null> {
  // Try both PDF and DOCX extensions
  const extensions = ["pdf", "docx"]

  for (const ext of extensions) {
    try {
      const blobUrl = `${VERCEL_BLOB_BASE_URL}/${fileName}.${ext}`

      console.log(`Attempting to fetch: ${blobUrl}`)

      const response = await fetch(blobUrl, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (response.ok) {
        const buffer = await response.arrayBuffer()
        const contentType =
          ext === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

        console.log(`Successfully fetched ${fileName}.${ext} (${buffer.byteLength} bytes)`)

        return {
          buffer,
          contentType,
          fileExtension: ext,
          originalUrl: blobUrl,
        }
      } else {
        console.log(`File not found: ${blobUrl} (Status: ${response.status})`)
      }
    } catch (error) {
      console.warn(`Failed to fetch ${fileName}.${ext}:`, error)
      continue
    }
  }

  return null
}

export async function GET(request: NextRequest, { params }: { params: { candidateId: string } }) {
  try {
    const { candidateId } = params

    console.log(`Download request for candidate: ${candidateId}`)

    // Get the actual filename from mapping
    const fileName = CANDIDATE_FILE_MAPPING[candidateId]
    if (!fileName) {
      console.error(`Candidate ID not found: ${candidateId}`)
      return NextResponse.json(
        {
          error: "Candidate not found",
          candidateId,
          availableCandidates: Object.keys(CANDIDATE_FILE_MAPPING),
        },
        { status: 404 },
      )
    }

    console.log(`Mapped ${candidateId} to filename: ${fileName}`)

    // Fetch file from Vercel Blob Storage
    const fileData = await fetchFromVercelBlob(fileName)

    if (!fileData) {
      console.error(`File not found for ${candidateId} (${fileName})`)
      return NextResponse.json(
        {
          error: "Resume file not found in Vercel Blob Storage",
          candidateId,
          fileName,
          attemptedUrls: [`${VERCEL_BLOB_BASE_URL}/${fileName}.pdf`, `${VERCEL_BLOB_BASE_URL}/${fileName}.docx`],
        },
        { status: 404 },
      )
    }

    console.log(`Serving file: ${fileData.originalUrl}`)

    // Create response with proper headers for download
    const response = new NextResponse(fileData.buffer, {
      status: 200,
      headers: {
        "Content-Type": fileData.contentType,
        "Content-Disposition": `attachment; filename="${fileName}_resume.${fileData.fileExtension}"`,
        "Content-Length": fileData.buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })

    return response
  } catch (error) {
    console.error("Resume download error:", error)
    return NextResponse.json(
      {
        error: "Failed to download resume from Vercel Blob Storage",
        details: error instanceof Error ? error.message : "Unknown error",
        candidateId: params.candidateId,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
