"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, File, X, Eye, Download } from "lucide-react"
import { createSupabaseClient } from "@/lib/supabase"
import { useUser } from "@/contexts/UserContext"
import { useLanguage } from "@/contexts/LanguageContext"

interface FileUploadProps {
  onFilesUploaded?: (files: string[]) => void
  existingFiles?: string[]
  maxFiles?: number
  maxSize?: number // in bytes
  acceptedTypes?: string[]
}

interface UploadedFile {
  name: string
  url: string
  size: number
  type: string
}

export default function FileUpload({
  onFilesUploaded,
  existingFiles = [],
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ["image/*", "application/pdf", ".doc", ".docx"],
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [error, setError] = useState("")
  const { user } = useUser()
  const { t } = useLanguage()
  const supabase = createSupabaseClient()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!user) {
        setError("You must be logged in to upload files")
        return
      }

      if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      setUploading(true)
      setError("")
      setUploadProgress(0)

      try {
        const uploadPromises = acceptedFiles.map(async (file, index) => {
          if (file.size > maxSize) {
            throw new Error(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
          }

          const fileExt = file.name.split(".").pop()
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

          const { data, error } = await supabase.storage.from("attachments").upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          })

          if (error) throw error

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage.from("attachments").getPublicUrl(data.path)

          setUploadProgress(((index + 1) / acceptedFiles.length) * 100)

          return {
            name: file.name,
            url: publicUrl,
            size: file.size,
            type: file.type,
          }
        })

        const results = await Promise.all(uploadPromises)
        const newFiles = [...uploadedFiles, ...results]
        setUploadedFiles(newFiles)

        if (onFilesUploaded) {
          onFilesUploaded(newFiles.map((f) => f.url))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed")
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    },
    [user, uploadedFiles, maxFiles, maxSize, onFilesUploaded, supabase.storage],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: uploading || uploadedFiles.length >= maxFiles,
  })

  const removeFile = async (index: number) => {
    const file = uploadedFiles[index]

    try {
      // Extract file path from URL
      const urlParts = file.url.split("/attachments/")
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        await supabase.storage.from("attachments").remove([filePath])
      }

      const newFiles = uploadedFiles.filter((_, i) => i !== index)
      setUploadedFiles(newFiles)

      if (onFilesUploaded) {
        onFilesUploaded(newFiles.map((f) => f.url))
      }
    } catch (err) {
      console.error("Error removing file:", err)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const previewFile = (file: UploadedFile) => {
    window.open(file.url, "_blank")
  }

  const downloadFile = (file: UploadedFile) => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      {uploadedFiles.length < maxFiles && (
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
              } ${uploading ? "pointer-events-none opacity-50" : ""}`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">{isDragActive ? t.dropFilesHere : t.dragDropFiles}</p>
              <p className="text-sm text-gray-500 mb-4">{t.orClickToSelect}</p>
              <Button type="button" variant="outline" disabled={uploading}>
                {t.selectFiles}
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                {t.maxFiles}: {maxFiles} | {t.maxSize}: {maxSize / 1024 / 1024}MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t.uploading}...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">{t.uploadedFiles}</h4>
          {uploadedFiles.map((file, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <File className="h-8 w-8 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {formatFileSize(file.size)}
                        </Badge>
                        {file.type.startsWith("image/") && (
                          <Badge variant="outline" className="text-xs">
                            {t.image}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => previewFile(file)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => downloadFile(file)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
