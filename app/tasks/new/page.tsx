"use client"

import type React from "react"

import { Layout } from "@/components/Layout"
import { useLanguage } from "@/contexts/LanguageContext"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Upload, X } from "lucide-react"

const services = [
  { id: "cvWriting", label: "cvWriting" },
  { id: "coverLetter", label: "coverLetter" },
  { id: "linkedinProfile", label: "linkedinProfile" },
]

export default function NewTask() {
  const { t, isRTL } = useLanguage()
  const { hasPermission } = useUser()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    clientName: "",
    birthdate: "",
    contactInfo: "",
    address: "",
    jobTitle: "",
    education: "",
    experience: "",
    skills: "",
    requiredServices: [] as string[],
    designerNotes: "",
    reviewerNotes: "",
    paymentStatus: "unpaid",
    attachments: [] as File[],
  })

  if (!hasPermission("edit_all")) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{isRTL ? "غير مصرح لك بالوصول" : "Access Denied"}</h1>
          <p className="text-gray-600">
            {isRTL ? "ليس لديك صلاحية لإنشاء مهام جديدة" : "You do not have permission to create new tasks"}
          </p>
        </div>
      </Layout>
    )
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      requiredServices: checked
        ? [...prev.requiredServices, serviceId]
        : prev.requiredServices.filter((s) => s !== serviceId),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files!)],
      }))
    }
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would integrate with Airtable API
    console.log("Submitting task:", formData)

    toast({
      title: t("taskSaved"),
      description: isRTL ? "تم إنشاء المهمة بنجاح" : "Task has been created successfully",
    })

    // Reset form
    setFormData({
      clientName: "",
      birthdate: "",
      contactInfo: "",
      address: "",
      jobTitle: "",
      education: "",
      experience: "",
      skills: "",
      requiredServices: [],
      designerNotes: "",
      reviewerNotes: "",
      paymentStatus: "unpaid",
      attachments: [],
    })
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{t("newTask")}</h1>
          <p className="text-gray-600 mt-2">{isRTL ? "إنشاء مهمة جديدة لعميل" : "Create a new task for a client"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "معلومات العميل" : "Client Information"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">{t("clientName")} *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange("clientName", e.target.value)}
                    required
                    className={isRTL ? "text-right" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="birthdate">{t("birthdate")}</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => handleInputChange("birthdate", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contactInfo">{t("contactInfo")}</Label>
                <Textarea
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                  placeholder={isRTL ? "رقم الهاتف، البريد الإلكتروني..." : "Phone, Email, ..."}
                  className={isRTL ? "text-right" : ""}
                />
              </div>

              <div>
                <Label htmlFor="address">{t("address")}</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={isRTL ? "text-right" : ""}
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "المعلومات المهنية" : "Professional Details"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobTitle">{t("jobTitle")}</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    className={isRTL ? "text-right" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">{t("experience")}</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="education">{t("education")}</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                  className={isRTL ? "text-right" : ""}
                />
              </div>

              <div>
                <Label htmlFor="skills">{t("skills")}</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  placeholder={isRTL ? "مثال: إدارة الوقت، القيادة" : "e.g., Time Management, Leadership"}
                  className={isRTL ? "text-right" : ""}
                />
              </div>
            </CardContent>
          </Card>

          {/* Services & Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "الخدمات والمتطلبات" : "Services & Requirements"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t("requiredServices")}</Label>
                <div className="space-y-2 mt-2">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={formData.requiredServices.includes(service.id)}
                        onCheckedChange={(checked) => handleServiceChange(service.id, checked as boolean)}
                      />
                      <Label htmlFor={service.id}>{t(service.label)}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="designerNotes">{t("designerNotes")}</Label>
                <Textarea
                  id="designerNotes"
                  value={formData.designerNotes}
                  onChange={(e) => handleInputChange("designerNotes", e.target.value)}
                  className={isRTL ? "text-right" : ""}
                />
              </div>

              <div>
                <Label htmlFor="reviewerNotes">{t("reviewerNotes")}</Label>
                <Textarea
                  id="reviewerNotes"
                  value={formData.reviewerNotes}
                  onChange={(e) => handleInputChange("reviewerNotes", e.target.value)}
                  className={isRTL ? "text-right" : ""}
                />
              </div>

              <div>
                <Label htmlFor="paymentStatus">{t("paymentStatus")}</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(value) => handleInputChange("paymentStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">{t("paid")}</SelectItem>
                    <SelectItem value="pending">{t("pending")}</SelectItem>
                    <SelectItem value="unpaid">{t("unpaid")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle>{t("attachments")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500">
                        {isRTL ? "اختر الملفات" : "Choose files"}
                      </span>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </Label>
                    <p className="text-gray-500 text-sm mt-1">{isRTL ? "PDF, Word, أو صور" : "PDF, Word, or Images"}</p>
                  </div>
                </div>

                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label>{isRTL ? "الملفات المحددة:" : "Selected files:"}</Label>
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button type="submit" size="lg">
              {isRTL ? "إضافة المهمة" : "Add Task"}
            </Button>
            <Button type="button" variant="outline" size="lg">
              {t("cancel")}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
