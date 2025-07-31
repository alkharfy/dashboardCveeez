"use client"

import { Layout } from "@/components/Layout"
import { useLanguage } from "@/contexts/LanguageContext"
import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Copy, Plus, Edit, Trash2, ExternalLink } from "lucide-react"

// Mock accounts data - in real app this would come from Airtable
const mockAccounts = [
  {
    id: "1",
    serviceName: "Canva",
    username: "design-team@company.com",
    password: "SecurePass123!",
    notes: "Pro account with team access",
    loginUrl: "https://canva.com/login",
  },
  {
    id: "2",
    serviceName: "Kickresume",
    username: "hr@company.com",
    password: "KickPass456@",
    notes: "Premium subscription",
    loginUrl: "https://kickresume.com/login",
  },
  {
    id: "3",
    serviceName: "Adobe Creative Cloud",
    username: "creative@company.com",
    password: "Adobe789#",
    notes: "Full suite access for design team",
    loginUrl: "https://adobe.com/login",
  },
]

export default function Accounts() {
  const { t, isRTL } = useLanguage()
  const { user, hasPermission } = useUser()
  const { toast } = useToast()
  const [accounts, setAccounts] = useState(mockAccounts)
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({})
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newAccount, setNewAccount] = useState({
    serviceName: "",
    username: "",
    password: "",
    notes: "",
    loginUrl: "",
  })

  if (!hasPermission("view_accounts")) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{isRTL ? "غير مصرح لك بالوصول" : "Access Denied"}</h1>
          <p className="text-gray-600">
            {isRTL ? "ليس لديك صلاحية لعرض بيانات الحسابات" : "You do not have permission to view accounts"}
          </p>
        </div>
      </Layout>
    )
  }

  const togglePasswordVisibility = (accountId: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }))
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: isRTL ? "تم النسخ" : "Copied",
        description: isRTL ? `تم نسخ ${type} بنجاح` : `${type} copied successfully`,
      })
    } catch (err) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "فشل في النسخ" : "Failed to copy",
        variant: "destructive",
      })
    }
  }

  const handleAddAccount = () => {
    if (!newAccount.serviceName || !newAccount.username || !newAccount.password) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    const account = {
      id: Date.now().toString(),
      ...newAccount,
    }

    setAccounts((prev) => [...prev, account])
    setNewAccount({
      serviceName: "",
      username: "",
      password: "",
      notes: "",
      loginUrl: "",
    })
    setIsAddingNew(false)

    toast({
      title: isRTL ? "تم الإضافة" : "Added",
      description: isRTL ? "تم إضافة الحساب بنجاح" : "Account added successfully",
    })
  }

  const deleteAccount = (accountId: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== accountId))
    toast({
      title: isRTL ? "تم الحذف" : "Deleted",
      description: isRTL ? "تم حذف الحساب" : "Account deleted",
    })
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("accounts")}</h1>
            <p className="text-gray-600 mt-2">
              {isRTL ? "بيانات الحسابات الخارجية للفريق" : "External service accounts for the team"}
            </p>
          </div>

          {hasPermission("edit_all") && (
            <Button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {isRTL ? "إضافة حساب" : "Add Account"}
            </Button>
          )}
        </div>

        {/* Add New Account Form */}
        {isAddingNew && (
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "إضافة حساب جديد" : "Add New Account"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceName">{isRTL ? "اسم الخدمة" : "Service Name"} *</Label>
                  <Input
                    id="serviceName"
                    value={newAccount.serviceName}
                    onChange={(e) => setNewAccount((prev) => ({ ...prev, serviceName: e.target.value }))}
                    className={isRTL ? "text-right" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="loginUrl">{isRTL ? "رابط تسجيل الدخول" : "Login URL"}</Label>
                  <Input
                    id="loginUrl"
                    value={newAccount.loginUrl}
                    onChange={(e) => setNewAccount((prev) => ({ ...prev, loginUrl: e.target.value }))}
                    className={isRTL ? "text-right" : ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">{isRTL ? "اسم المستخدم / البريد" : "Username/Email"} *</Label>
                  <Input
                    id="username"
                    value={newAccount.username}
                    onChange={(e) => setNewAccount((prev) => ({ ...prev, username: e.target.value }))}
                    className={isRTL ? "text-right" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="password">{isRTL ? "كلمة المرور" : "Password"} *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newAccount.password}
                    onChange={(e) => setNewAccount((prev) => ({ ...prev, password: e.target.value }))}
                    className={isRTL ? "text-right" : ""}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">{isRTL ? "ملاحظات" : "Notes"}</Label>
                <Input
                  id="notes"
                  value={newAccount.notes}
                  onChange={(e) => setNewAccount((prev) => ({ ...prev, notes: e.target.value }))}
                  className={isRTL ? "text-right" : ""}
                />
              </div>

              <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Button onClick={handleAddAccount}>{isRTL ? "إضافة" : "Add"}</Button>
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  {t("cancel")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accounts List */}
        <div className="grid gap-4">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">{account.serviceName}</CardTitle>
                    {account.loginUrl && (
                      <Button variant="ghost" size="sm" onClick={() => window.open(account.loginUrl, "_blank")}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {hasPermission("edit_all") && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteAccount(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      {isRTL ? "اسم المستخدم / البريد" : "Username/Email"}
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input value={account.username} readOnly className={`bg-gray-50 ${isRTL ? "text-right" : ""}`} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(account.username, isRTL ? "اسم المستخدم" : "Username")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">{isRTL ? "كلمة المرور" : "Password"}</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type={showPasswords[account.id] ? "text" : "password"}
                        value={account.password}
                        readOnly
                        className={`bg-gray-50 ${isRTL ? "text-right" : ""}`}
                      />
                      <Button variant="ghost" size="sm" onClick={() => togglePasswordVisibility(account.id)}>
                        {showPasswords[account.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(account.password, isRTL ? "كلمة المرور" : "Password")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {account.notes && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">{isRTL ? "ملاحظات" : "Notes"}</Label>
                    <p className="text-gray-900 mt-1">{account.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {accounts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 text-lg">{isRTL ? "لا توجد حسابات مضافة بعد" : "No accounts added yet"}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}
