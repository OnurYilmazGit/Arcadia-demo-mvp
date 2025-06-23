interface BlobStorageConfig {
  baseUrl: string
  token: string
}

interface FileData {
  buffer: ArrayBuffer
  contentType: string
  fileExtension: string
  fileName: string
}

export class BlobStorageService {
  private config: BlobStorageConfig

  constructor() {
    this.config = {
      baseUrl: process.env.CV_STORE_BLOB_URL || "https://your-blob-storage.com/cv_store",
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }
  }

  async fetchFile(filePath: string): Promise<FileData | null> {
    try {
      const fullUrl = `${this.config.baseUrl}/${filePath}`

      const response = await fetch(fullUrl, {
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        console.warn(`Failed to fetch ${filePath}: ${response.status} ${response.statusText}`)
        return null
      }

      const buffer = await response.arrayBuffer()
      const fileExtension = filePath.split(".").pop()?.toLowerCase() || ""

      let contentType = "application/octet-stream"
      if (fileExtension === "pdf") {
        contentType = "application/pdf"
      } else if (fileExtension === "docx") {
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      }

      return {
        buffer,
        contentType,
        fileExtension,
        fileName: filePath.split("/").pop() || filePath,
      }
    } catch (error) {
      console.error(`Error fetching file ${filePath}:`, error)
      return null
    }
  }

  async listFiles(directory = ""): Promise<string[]> {
    try {
      const listUrl = `${this.config.baseUrl}/${directory}`

      const response = await fetch(listUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to list files: ${response.status}`)
      }

      const data = await response.json()
      return data.files || []
    } catch (error) {
      console.error(`Error listing files in ${directory}:`, error)
      return []
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      const fullUrl = `${this.config.baseUrl}/${filePath}`

      const response = await fetch(fullUrl, {
        method: "HEAD",
        headers: {
          Authorization: `Bearer ${this.config.token}`,
        },
      })

      return response.ok
    } catch (error) {
      return false
    }
  }
}

export const blobStorage = new BlobStorageService()
