"use client"

import { Layout } from "@/components/Layout"
import { useLanguage } from "@/contexts/LanguageContext"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/StarRating"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Eye, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

// Mock data - in real app this would come from Airtable
const mockAllTasks = [
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
    paymentStatus: "paid",
  },
  {
    id: "2",
    clientName: "محمد علي",
    services: ["LinkedIn Profile"],
    status: "inProgress",
    date: "2024-01-14",
    designerRating: 0,
    reviewerRating: 0,
    assignedDesigner: "سعد أحمد",
    assignedReviewer: "نورا محمد",
    paymentStatus: "pending",
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
    paymentStatus: "unpaid",
  },
  {
    id: "4",
    clientName: "عبدالله سعد",
    services: ["CV Writing", "LinkedIn Profile"],
    status: "inReview",
    date: "2024-01-12",
    designerRating: 0,
    reviewerRating: 0,
    assignedDesigner: "سعد أحمد",
    assignedReviewer: "نورا محمد",
    paymentStatus: "paid",
  },
]

export default function AllTasks() {
  const { t, isRTL } = useLanguage()
  const { user, hasPermission } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [designerFilter, setDesignerFilter] = useState("all")

  if (!hasPermission("view_all")) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{isRTL ? "غير مصرح لك بالوصول" : "Access Denied"}</h1>
          <p className="text-gray-600">
            {isRTL ? "ليس لديك صلاحية لعرض جميع المهام" : "You do not have permission to view all tasks"}
          </p>
        </div>
      </Layout>
    )
  }

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

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "unpaid":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTasks = mockAllTasks.filter((task) => {
    const matchesSearch =
      task.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedDesigner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesDesigner = designerFilter === "all" || task.assignedDesigner === designerFilter
    return matchesSearch && matchesStatus && matchesDesigner
  })

  const exportToCSV = () => {
    const headers = ["Client Name", "Services", "Status", "Designer", "Reviewer", "Date", "Payment"]
    const csvContent = [
      headers.join(","),
      ...filteredTasks.map((task) =>
        [
          task.clientName,
          task.services.join(";"),
          task.status,
          task.assignedDesigner,
          task.assignedReviewer,
          task.date,
          task.paymentStatus,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "tasks-export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const uniqueDesigners = [...new Set(mockAllTasks.map((task) => task.assignedDesigner))]

  return (
    <Layout>
      <div className="space-y-6">
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("allTasks")}</h1>
            <p className="text-gray-600 mt-2">
              {isRTL
                ? `${filteredTasks.length} مهمة من أصل ${mockAllTasks.length}`
                : `${filteredTasks.length} of ${mockAllTasks.length} tasks`}
            </p>
          </div>

          <Button onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {t("export")}
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${isRTL ? "text-right" : ""}`}>
              <div>
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

              <select
                value={designerFilter}
                onChange={(e) => setDesignerFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{isRTL ? "كل المصممين" : "All Designers"}</option>
                {uniqueDesigners.map((designer) => (
                  <option key={designer} value={designer}>
                    {designer}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                    setDesignerFilter("all")
                  }}
                >
                  {isRTL ? "مسح الفلاتر" : "Clear Filters"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRTL ? "text-right" : ""}>{t("clientName")}</TableHead>
                    <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الخدمات" : "Services"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الحالة" : "Status"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "المصمم" : "Designer"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "المراجع" : "Reviewer"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "التاريخ" : "Date"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الدفع" : "Payment"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "التقييم" : "Rating"}</TableHead>
                    <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الإجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.clientName}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {task.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {t(service.toLowerCase().replace(" ", ""))}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)}>{t(task.status)}</Badge>
                      </TableCell>
                      <TableCell>{task.assignedDesigner}</TableCell>
                      <TableCell>{task.assignedReviewer}</TableCell>
                      <TableCell>{task.date}</TableCell>
                      <TableCell>
                        <Badge className={getPaymentColor(task.paymentStatus)}>{t(task.paymentStatus)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-xs">{isRTL ? "م:" : "D:"}</span>
                            <StarRating value={task.designerRating} readonly size="sm" />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs">{isRTL ? "ر:" : "R:"}</span>
                            <StarRating value={task.reviewerRating} readonly size="sm" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Link href={`/tasks/${task.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {hasPermission("edit_all") && (
                            <>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
