"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { createSupabaseClient } from "@/lib/supabase"
import { useUser } from "@/contexts/UserContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, File, X, Eye, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  taskId?: string
  onFilesChange?: (files: UploadedFile[]) => void
  initialFiles?: UploadedFile[]
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  path: string
}

export default function FileUpload({
  taskId,
  onFilesChange,
  initialFiles = [],
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ["image/*", "application/pdf", ".doc", ".docx"],
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const { user } = useUser()
  const { t, language } = useLanguage()
  const supabase = createSupabaseClient()

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    if (!user) return null

    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = taskId ? `tasks/${taskId}/${fileName}` : `temp/${user.id}/${fileName}`

    try {
      const { data, error } = await supabase.storage.from("attachments").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Upload error:", error)
        return null
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("attachments").getPublicUrl(filePath)

      return {
        id: fileName,
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl,
        path: filePath,
      }
    } catch (error) {
      console.error("Upload error:", error)
      return null
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(t.tooManyFiles.replace("{max}", maxFiles.toString()))
        return
      }

      setUploading(true)
      setError("")
      setUploadProgress(0)

      const uploadPromises = acceptedFiles.map(async (file, index) => {
        const uploadedFile = await uploadFile(file)
        setUploadProgress(((index + 1) / acceptedFiles.length) * 100)
        return uploadedFile
      })

      try {
        const uploadedFiles = await Promise.all(uploadPromises)
        const validFiles = uploadedFiles.filter(Boolean) as UploadedFile[]

        const newFiles = [...files, ...validFiles]
        setFiles(newFiles)
        onFilesChange?.(newFiles)
      } catch (error) {
        setError(t.uploadError)
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }
    },
    [files, maxFiles, taskId, user, onFilesChange, t],
  )

  const removeFile = async (fileToRemove: UploadedFile) => {
    try {
      // Delete from storage
      await supabase.storage.from("attachments").remove([fileToRemove.path])

      const newFiles = files.filter((file) => file.id !== fileToRemove.id)
      setFiles(newFiles)
      onFilesChange?.(newFiles)
    } catch (error) {
      console.error("Error removing file:", error)
    }
  }

  const downloadFile = async (file: UploadedFile) => {
    try {
      const { data, error } = await supabase.storage.from("attachments").download(file.path)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading file:", error)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    maxSize,
    disabled: uploading || files.length >= maxFiles,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={`space-y-4 ${language === "ar" ? "rtl" : "ltr"}`}>
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400",
              (uploading || files.length >= maxFiles) && "opacity-50 cursor-not-allowed",
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">{isDragActive ? t.dropFiles : t.dragDropFiles}</p>
            <p className="text-sm text-gray-500 mb-4">
              {t.supportedFormats}: {acceptedTypes.join(", ")}
            </p>
            <p className="text-xs text-gray-400">
              {t.maxFileSize}: {formatFileSize(maxSize)} | {t.maxFiles}: {maxFiles}
            </p>
          </div>

          {uploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-500 mt-2 text-center">
                {t.uploading}... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">
              {t.uploadedFiles} ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <File className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {file.type.startsWith("image/") && (
                      <Button variant="ghost" size="sm" onClick={() => window.open(file.url, "_blank")}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => downloadFile(file)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
