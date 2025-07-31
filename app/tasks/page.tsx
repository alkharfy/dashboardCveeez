"use client"

import { Layout } from "@/components/Layout"
import { useLanguage } from "@/contexts/LanguageContext"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/StarRating"
import { Search, Eye } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

// Mock data - in real app this would come from Airtable filtered by user
const mockTasks = [
  {
    id: "1",
    clientName: "سارة أحمد",
    services: ["CV Writing", "Cover Letter"],
    status: "completed",
    date: "2024-01-15",
    designerRating: 4,
    reviewerRating: 5,
    assignedDesigner: "أحمد محمد",
    assignedReviewer: "فاطمة علي",
  },
  {
    id: "2",
    clientName: "محمد علي",
    services: ["LinkedIn Profile"],
    status: "inProgress",
    date: "2024-01-14",
    designerRating: 0,
    reviewerRating: 0,
    assignedDesigner: "أحمد محمد",
    assignedReviewer: "فاطمة علي",
  },
  {
    id: "3",
    clientName: "فاطمة خالد",
    services: ["CV Writing"],
    status: "pending",
    date: "2024-01-13",
    designerRating: 0,
    reviewerRating: 0,
    assignedDesigner: "أحمد محمد",
    assignedReviewer: "فاطمة علي",
  },
]

export default function MyTasks() {
  const { t, isRTL } = useLanguage()
  const { user } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

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

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch = task.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Layout>
      <div className="space-y-6">
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("myTasks")}</h1>
            <p className="text-gray-600 mt-2">
              {isRTL ? `${filteredTasks.length} مهمة` : `${filteredTasks.length} tasks`}
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute top-3 h-4 w-4 text-gray-400 ${isRTL ? "right-3" : "left-3"}`} />
                  <Input
                    placeholder={t("search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={isRTL ? "pr-10 text-right" : "pl-10"}
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{isRTL ? "كل الحالات" : "All Status"}</option>
                <option value="pending">{t("pending")}</option>
                <option value="inProgress">{t("inProgress")}</option>
                <option value="inReview">{t("inReview")}</option>
                <option value="completed">{t("completed")}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg">{t("noTasks")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{task.clientName}</h3>
                        <Badge className={getStatusColor(task.status)}>{t(task.status)}</Badge>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">{isRTL ? "الخدمات:" : "Services:"}</span>
                          <span className="ml-2">
                            {task.services.map((service) => t(service.toLowerCase().replace(" ", ""))).join(", ")}
                          </span>
                        </div>

                        <div>
                          <span className="font-medium">{isRTL ? "التاريخ:" : "Date:"}</span>
                          <span className="ml-2">{task.date}</span>
                        </div>

                        {user?.role === "admin" || user?.role === "manager" ? (
                          <div>
                            <span className="font-medium">{isRTL ? "المصمم:" : "Designer:"}</span>
                            <span className="ml-2">{task.assignedDesigner}</span>
                          </div>
                        ) : null}

                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">{t("designerRating")}:</span>
                            <StarRating value={task.designerRating} readonly size="sm" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">{t("reviewerRating")}:</span>
                            <StarRating value={task.reviewerRating} readonly size="sm" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link href={`/tasks/${task.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          {isRTL ? "عرض" : "View"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
