import { NextResponse } from "next/server"
import { blobStorage } from "@/lib/blob-storage"

export async function GET() {
  try {
    const files = await blobStorage.listFiles("candidate_files")

    return NextResponse.json({
      success: true,
      files,
      totalFiles: files.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error listing resume files:", error)
    return NextResponse.json(
      {
        error: "Failed to list resume files",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
