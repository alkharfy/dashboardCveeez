"use client"

import { Layout } from "@/components/Layout"
import { useLanguage } from "@/contexts/LanguageContext"
import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Clock, Users, Star, TrendingUp, Calendar } from "lucide-react"

// Mock data - in real app this would come from Airtable
const mockStats = {
  totalTasks: 120,
  completedTasks: 90,
  pendingTasks: 30,
  totalClients: 50,
  avgRating: 4.2,
  thisMonth: 25,
}

const mockRecentTasks = [
  {
    id: "1",
    clientName: "سارة أحمد",
    service: "CV Writing",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "2",
    clientName: "محمد علي",
    service: "LinkedIn Profile",
    status: "inProgress",
    date: "2024-01-14",
  },
  {
    id: "3",
    clientName: "فاطمة خالد",
    service: "Cover Letter",
    status: "pending",
    date: "2024-01-13",
  },
]

export default function Dashboard() {
  const { t, isRTL } = useLanguage()
  const { user } = useUser()

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = "blue",
  }: {
    title: string
    value: string | number
    icon: any
    color?: string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "inProgress":
        return "text-blue-600"
      case "pending":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isRTL ? `مرحباً، ${user?.name}` : `Welcome, ${user?.name}`}
          </h1>
          <p className="text-gray-600 mt-2">
            {t("dashboard")} - {new Date().toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={t("totalTasks")} value={mockStats.totalTasks} icon={CheckSquare} color="blue" />
          <StatCard title={t("completedTasks")} value={mockStats.completedTasks} icon={CheckSquare} color="green" />
          <StatCard title={t("pendingTasks")} value={mockStats.pendingTasks} icon={Clock} color="yellow" />
          <StatCard title={t("avgRating")} value={`${mockStats.avgRating} ★`} icon={Star} color="purple" />
        </div>

        {/* Additional Stats for Admin/Manager */}
        {(user?.role === "admin" || user?.role === "manager") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title={isRTL ? "إجمالي العملاء" : "Total Clients"}
              value={mockStats.totalClients}
              icon={Users}
              color="indigo"
            />
            <StatCard
              title={isRTL ? "مهام هذا الشهر" : "Tasks This Month"}
              value={mockStats.thisMonth}
              icon={TrendingUp}
              color="emerald"
            />
          </div>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {isRTL ? "النشاط الأخير" : "Recent Activity"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className={isRTL ? "text-right" : "text-left"}>
                    <div className="font-medium">{task.clientName}</div>
                    <div className="text-sm text-gray-600">{t(task.service.toLowerCase().replace(" ", ""))}</div>
                  </div>
                  <div className={`text-sm ${isRTL ? "text-left" : "text-right"}`}>
                    <div className={`font-medium ${getStatusColor(task.status)}`}>{t(task.status)}</div>
                    <div className="text-gray-500">{task.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
