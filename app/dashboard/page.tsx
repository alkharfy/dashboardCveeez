"use client"

import { Layout } from "@/components/Layout"
import { useLanguage } from "@/contexts/LanguageContext"
import { useUser } from "@/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Clock, Users, Star, TrendingUp, Calendar, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { airtable } from "@/lib/airtable"
import { ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts"

export default function Dashboard() {
  const { t, isRTL } = useLanguage()
  const { user } = useUser()
  const [stats, setStats] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, activityData] = await Promise.all([
          airtable.getDashboardStats(),
          airtable.getRecentActivity(10),
        ])
        setStats(statsData)
        setRecentActivity(activityData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = "blue",
    trend,
  }: {
    title: string
    value: string | number
    icon: any
    color?: string
    trend?: string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
      </CardContent>
    </Card>
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600"
      case "In Progress":
        return "text-blue-600"
      case "Pending":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  const chartData = [
    { name: t("completed"), value: stats?.completedTasks || 0, color: "#10b981" },
    { name: t("inProgress"), value: stats?.inProgressTasks || 0, color: "#3b82f6" },
    { name: t("pending"), value: stats?.pendingTasks || 0, color: "#f59e0b" },
    { name: t("overdueTasks"), value: stats?.overdueTasks || 0, color: "#ef4444" },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">{isRTL ? `مرحباً، ${user?.name}` : `Welcome, ${user?.name}`}</h1>
          <p className="text-muted-foreground mt-2">
            {t("dashboard")} - {new Date().toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t("totalTasks")}
            value={stats?.totalTasks || 0}
            icon={CheckSquare}
            color="blue"
            trend={`+${stats?.thisMonthTasks || 0} ${t("thisMonth")}`}
          />
          <StatCard title={t("completedTasks")} value={stats?.completedTasks || 0} icon={CheckSquare} color="green" />
          <StatCard title={t("pendingTasks")} value={stats?.pendingTasks || 0} icon={Clock} color="yellow" />
          <StatCard title={t("overdueTasks")} value={stats?.overdueTasks || 0} icon={AlertTriangle} color="red" />
        </div>

        {/* Additional Stats for Admin/Manager */}
        {(user?.role === "admin" || user?.role === "manager") && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title={t("totalClients")} value={stats?.totalClients || 0} icon={Users} color="indigo" />
            <StatCard title={t("avgRating")} value={`${stats?.avgRating || 0} ★`} icon={Star} color="purple" />
            <StatCard
              title={isRTL ? "إجمالي المستخدمين" : "Total Users"}
              value={stats?.totalUsers || 0}
              icon={TrendingUp}
              color="emerald"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t("taskDistribution")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {chartData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("recentActivity")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className={`flex items-center justify-between p-3 bg-muted/50 rounded-lg ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <div className="font-medium">{activity.clientName}</div>
                        <div className="text-sm text-muted-foreground">{isRTL ? "مهمة جديدة" : "New task created"}</div>
                      </div>
                      <div className={`text-sm ${isRTL ? "text-left" : "text-right"}`}>
                        <div className={`font-medium ${getStatusColor(activity.status)}`}>
                          {t(activity.status.toLowerCase().replace(" ", ""))}
                        </div>
                        <div className="text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">{t("noData")}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
