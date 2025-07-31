"use client"

import { Layout } from "@/components/Layout"
import { useLanguage } from "@/contexts/LanguageContext"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Briefcase, MapPin, Phone, Camera } from "lucide-react"

export default function Profile() {
  const { t, isRTL } = useLanguage()
  const { user, setUser } = useUser()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    workplace: user?.workplace || "",
    status: user?.status || "Available",
    phone: "+966501234567",
    department: "Design Team",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    // Here you would integrate with Airtable API to update user profile
    if (user) {
      setUser({
        ...user,
        name: formData.name,
        workplace: formData.workplace,
        status: formData.status,
      })
    }

    setIsEditing(false)
    toast({
      title: isRTL ? "تم الحفظ" : "Saved",
      description: isRTL ? "تم حفظ التغييرات بنجاح" : "Profile updated successfully",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Busy":
        return "bg-red-100 text-red-800"
      case "On Leave":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("profile")}</h1>
            <p className="text-gray-600 mt-2">
              {isRTL ? "إدارة معلوماتك الشخصية" : "Manage your personal information"}
            </p>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>{t("save")}</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  {t("cancel")}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>{t("edit")}</Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture & Basic Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-lg">{getInitials(formData.name)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold">{formData.name}</h2>
                  <p className="text-gray-600">{t(user?.role || "")}</p>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(formData.status)}`}
                  >
                    {t(formData.status.toLowerCase().replace(" ", ""))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {isRTL ? "المعلومات الشخصية" : "Personal Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{isRTL ? "الاسم الكامل" : "Full Name"}</Label>
                  <div className="relative">
                    <User className={`absolute top-3 h-4 w-4 text-gray-400 ${isRTL ? "right-3" : "left-3"}`} />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      disabled={!isEditing}
                      className={`${isRTL ? "pr-10 text-right" : "pl-10"} ${!isEditing ? "bg-gray-50" : ""}`}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">{isRTL ? "البريد الإلكتروني" : "Email"}</Label>
                  <div className="relative">
                    <Mail className={`absolute top-3 h-4 w-4 text-gray-400 ${isRTL ? "right-3" : "left-3"}`} />
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                      className={`${isRTL ? "pr-10 text-right" : "pl-10"} bg-gray-50`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {isRTL ? "لا يمكن تغيير البريد الإلكتروني" : "Email cannot be changed"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">{isRTL ? "رقم الهاتف" : "Phone Number"}</Label>
                  <div className="relative">
                    <Phone className={`absolute top-3 h-4 w-4 text-gray-400 ${isRTL ? "right-3" : "left-3"}`} />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                      className={`${isRTL ? "pr-10 text-right" : "pl-10"} ${!isEditing ? "bg-gray-50" : ""}`}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="workplace">{isRTL ? "مكان العمل" : "Workplace"}</Label>
                  <div className="relative">
                    <MapPin className={`absolute top-3 h-4 w-4 text-gray-400 ${isRTL ? "right-3" : "left-3"}`} />
                    <Input
                      id="workplace"
                      value={formData.workplace}
                      onChange={(e) => handleInputChange("workplace", e.target.value)}
                      disabled={!isEditing}
                      className={`${isRTL ? "pr-10 text-right" : "pl-10"} ${!isEditing ? "bg-gray-50" : ""}`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">{isRTL ? "القسم" : "Department"}</Label>
                  <div className="relative">
                    <Briefcase className={`absolute top-3 h-4 w-4 text-gray-400 ${isRTL ? "right-3" : "left-3"}`} />
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                      disabled={!isEditing}
                      className={`${isRTL ? "pr-10 text-right" : "pl-10"} ${!isEditing ? "bg-gray-50" : ""}`}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">{isRTL ? "الحالة الحالية" : "Current Status"}</Label>
                  {isEditing ? (
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">{isRTL ? "متاح" : "Available"}</SelectItem>
                        <SelectItem value="Busy">{isRTL ? "مشغول" : "Busy"}</SelectItem>
                        <SelectItem value="On Leave">{isRTL ? "في إجازة" : "On Leave"}</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={formData.status} disabled className={`bg-gray-50 ${isRTL ? "text-right" : ""}`} />
                  )}
                </div>
              </div>

              <div>
                <Label>{isRTL ? "الدور" : "Role"}</Label>
                <Input value={t(user?.role || "")} disabled className={`bg-gray-50 ${isRTL ? "text-right" : ""}`} />
                <p className="text-xs text-gray-500 mt-1">
                  {isRTL ? "يتم إدارة الأدوار من قبل المشرف" : "Roles are managed by admin"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "إحصائيات الحساب" : "Account Statistics"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">15</div>
                <div className="text-sm text-gray-600">{isRTL ? "المهام المكتملة" : "Tasks Completed"}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">4.2</div>
                <div className="text-sm text-gray-600">{isRTL ? "متوسط التقييم" : "Average Rating"}</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-sm text-gray-600">{isRTL ? "المهام الحالية" : "Current Tasks"}</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-sm text-gray-600">{isRTL ? "أشهر الخبرة" : "Months Experience"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
