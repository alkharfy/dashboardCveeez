"use client"

import type React from "react"

import { Layout } from "@/components/Layout"
import { useLanguage } from "@/contexts/LanguageContext"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/StarRating"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download, Edit, Save, User, Briefcase, Star, MessageSquare } from "lucide-react"

// Mock task data - in real app this would come from Airtable
const mockTask = {
  id: "1",
  clientName: "سارة أحمد",
  birthdate: "1990-05-15",
  contactInfo: "sara.ahmed@email.com\n+966501234567",
  address: "الرياض، المملكة العربية السعودية",
  jobTitle: "مطور برمجيات",
  education: "بكالوريوس علوم الحاسب",
  experience: "5",
  skills: "JavaScript, React, Node.js, Python",
  requiredServices: ["CV Writing", "Cover Letter"],
  designerNotes: "يفضل التصميم الحديث والألوان الهادئة",
  reviewerNotes: "التركيز على الخبرات التقنية",
  paymentStatus: "paid",
  status: "inProgress",
  date: "2024-01-15",
  designerRating: 4,
  reviewerRating: 0,
  designerFeedback: "عمل ممتاز، التصميم احترافي",
  reviewerFeedback: "",
  assignedDesigner: "أحمد محمد",
  assignedReviewer: "فاطمة علي",
  attachments: [
    { name: "old_cv.pdf", url: "#", type: "pdf" },
    { name: "certificates.jpg", url: "#", type: "image" },
  ],
}

export default function TaskDetails({ params }: { params: { id: string } }) {
  const { t, isRTL } = useLanguage()
  const { user, hasPermission } = useUser()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [task, setTask] = useState(mockTask)
  const [editData, setEditData] = useState({
    designerRating: task.designerRating,
    reviewerRating: task.reviewerRating,
    designerFeedback: task.designerFeedback,
    reviewerFeedback: task.reviewerFeedback,
    status: task.status,
  })

  const canEdit =
    hasPermission("edit_all") ||
    (user?.role === "designer" && task.assignedDesigner === user.name) ||
    (user?.role === "reviewer" && task.assignedReviewer === user.name)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "inProgress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inReview":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSave = async () => {
    // Here you would integrate with Airtable API
    setTask((prev) => ({ ...prev, ...editData }))
    setIsEditing(false)

    toast({
      title: t("taskSaved"),
      description: isRTL ? "تم حفظ التغييرات بنجاح" : "Changes saved successfully",
    })
  }

  const InfoCard = ({
    title,
    children,
    icon: Icon,
  }: {
    title: string
    children: React.ReactNode
    icon: any
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{task.clientName}</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge className={getStatusColor(task.status)}>{t(task.status)}</Badge>
              <span className="text-gray-600">{task.date}</span>
            </div>
          </div>

          {canEdit && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    {t("save")}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    {t("cancel")}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {t("edit")}
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Information */}
          <InfoCard title={isRTL ? "معلومات العميل" : "Client Information"} icon={User}>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-600">{t("clientName")}</Label>
                <p className="text-gray-900">{task.clientName}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">{t("birthdate")}</Label>
                <p className="text-gray-900">{task.birthdate}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">{t("contactInfo")}</Label>
                <p className="text-gray-900 whitespace-pre-line">{task.contactInfo}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">{t("address")}</Label>
                <p className="text-gray-900">{task.address}</p>
              </div>
            </div>
          </InfoCard>

          {/* Professional Details */}
          <InfoCard title={isRTL ? "المعلومات المهنية" : "Professional Details"} icon={Briefcase}>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-600">{t("jobTitle")}</Label>
                <p className="text-gray-900">{task.jobTitle}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">{t("education")}</Label>
                <p className="text-gray-900">{task.education}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">{t("experience")}</Label>
                <p className="text-gray-900">
                  {task.experience} {isRTL ? "سنوات" : "years"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">{t("skills")}</Label>
                <p className="text-gray-900">{task.skills}</p>
              </div>
            </div>
          </InfoCard>

          {/* Services & Payment */}
          <InfoCard title={isRTL ? "الخدمات والدفع" : "Services & Payment"} icon={FileText}>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-600">{t("requiredServices")}</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {task.requiredServices.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {t(service.toLowerCase().replace(" ", ""))}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">{t("paymentStatus")}</Label>
                <Badge
                  className={task.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {t(task.paymentStatus)}
                </Badge>
              </div>
            </div>
          </InfoCard>

          {/* Attachments */}
          <InfoCard title={t("attachments")} icon={FileText}>
            <div className="space-y-2">
              {task.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{file.name}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>

        {/* Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InfoCard title={t("designerNotes")} icon={MessageSquare}>
            <p className="text-gray-900">{task.designerNotes}</p>
          </InfoCard>

          <InfoCard title={t("reviewerNotes")} icon={MessageSquare}>
            <p className="text-gray-900">{task.reviewerNotes}</p>
          </InfoCard>
        </div>

        {/* Ratings & Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              {isRTL ? "التقييمات والتعليقات" : "Ratings & Feedback"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Designer Rating */}
            <div>
              <Label className="text-sm font-medium">{t("designerRating")}</Label>
              <div className="mt-2">
                <StarRating
                  value={isEditing ? editData.designerRating : task.designerRating}
                  onChange={(value) => setEditData((prev) => ({ ...prev, designerRating: value }))}
                  readonly={!isEditing || user?.role !== "reviewer"}
                />
              </div>
              <div className="mt-3">
                <Label className="text-sm font-medium">{t("feedback")}</Label>
                {isEditing && user?.role === "reviewer" ? (
                  <Textarea
                    value={editData.designerFeedback}
                    onChange={(e) => setEditData((prev) => ({ ...prev, designerFeedback: e.target.value }))}
                    className={`mt-1 ${isRTL ? "text-right" : ""}`}
                  />
                ) : (
                  <p className="text-gray-900 mt-1">
                    {task.designerFeedback || (isRTL ? "لا يوجد تعليق" : "No feedback")}
                  </p>
                )}
              </div>
            </div>

            {/* Reviewer Rating */}
            <div>
              <Label className="text-sm font-medium">{t("reviewerRating")}</Label>
              <div className="mt-2">
                <StarRating
                  value={isEditing ? editData.reviewerRating : task.reviewerRating}
                  onChange={(value) => setEditData((prev) => ({ ...prev, reviewerRating: value }))}
                  readonly={!isEditing || (user?.role !== "admin" && user?.role !== "manager")}
                />
              </div>
              <div className="mt-3">
                <Label className="text-sm font-medium">{t("feedback")}</Label>
                {isEditing && (user?.role === "admin" || user?.role === "manager") ? (
                  <Textarea
                    value={editData.reviewerFeedback}
                    onChange={(e) => setEditData((prev) => ({ ...prev, reviewerFeedback: e.target.value }))}
                    className={`mt-1 ${isRTL ? "text-right" : ""}`}
                  />
                ) : (
                  <p className="text-gray-900 mt-1">
                    {task.reviewerFeedback || (isRTL ? "لا يوجد تعليق" : "No feedback")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
