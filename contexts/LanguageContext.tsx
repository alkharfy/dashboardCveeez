"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ar"

interface Translations {
  // Navigation
  dashboard: string
  tasks: string
  allTasks: string
  accounts: string
  profile: string
  settings: string
  logout: string

  // Authentication
  welcome: string
  loginDescription: string
  signIn: string
  signUp: string
  magicLink: string
  email: string
  password: string
  emailPlaceholder: string
  passwordPlaceholder: string
  sendMagicLink: string
  accessDenied: string
  accessDeniedDescription: string
  backToDashboard: string

  // Dashboard
  welcomeBack: string
  totalTasks: string
  completedTasks: string
  pendingTasks: string
  totalAccounts: string
  recentTasks: string
  taskDistribution: string
  accountsOverview: string

  // Tasks
  newTask: string
  editTask: string
  taskTitle: string
  taskDescription: string
  status: string
  priority: string
  assignedTo: string
  dueDate: string
  attachments: string
  createTask: string
  updateTask: string
  deleteTask: string

  // Status
  pending: string
  inProgress: string
  completed: string

  // Priority
  low: string
  medium: string
  high: string

  // File Upload
  dragDropFiles: string
  dropFilesHere: string
  orClickToSelect: string
  selectFiles: string
  maxFiles: string
  maxSize: string
  uploading: string
  uploadedFiles: string
  image: string

  // Common
  save: string
  cancel: string
  delete: string
  edit: string
  view: string
  search: string
  filter: string
  actions: string
  loading: string
  noData: string

  // Theme
  light: string
  dark: string
  system: string

  // Language
  english: string
  arabic: string
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    tasks: "My Tasks",
    allTasks: "All Tasks",
    accounts: "Accounts",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",

    // Authentication
    welcome: "Welcome",
    loginDescription: "Sign in to your account to continue",
    signIn: "Sign In",
    signUp: "Sign Up",
    magicLink: "Magic Link",
    email: "Email",
    password: "Password",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    sendMagicLink: "Send Magic Link",
    accessDenied: "Access Denied",
    accessDeniedDescription: "You do not have permission to access this page.",
    backToDashboard: "Back to Dashboard",

    // Dashboard
    welcomeBack: "Welcome back",
    totalTasks: "Total Tasks",
    completedTasks: "Completed Tasks",
    pendingTasks: "Pending Tasks",
    totalAccounts: "Total Accounts",
    recentTasks: "Recent Tasks",
    taskDistribution: "Task Distribution",
    accountsOverview: "Accounts Overview",

    // Tasks
    newTask: "New Task",
    editTask: "Edit Task",
    taskTitle: "Task Title",
    taskDescription: "Task Description",
    status: "Status",
    priority: "Priority",
    assignedTo: "Assigned To",
    dueDate: "Due Date",
    attachments: "Attachments",
    createTask: "Create Task",
    updateTask: "Update Task",
    deleteTask: "Delete Task",

    // Status
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",

    // Priority
    low: "Low",
    medium: "Medium",
    high: "High",

    // File Upload
    dragDropFiles: "Drag & drop files here",
    dropFilesHere: "Drop files here",
    orClickToSelect: "or click to select files",
    selectFiles: "Select Files",
    maxFiles: "Max files",
    maxSize: "Max size",
    uploading: "Uploading",
    uploadedFiles: "Uploaded Files",
    image: "Image",

    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    search: "Search",
    filter: "Filter",
    actions: "Actions",
    loading: "Loading...",
    noData: "No data available",

    // Theme
    light: "Light",
    dark: "Dark",
    system: "System",

    // Language
    english: "English",
    arabic: "العربية",
  },
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    tasks: "مهامي",
    allTasks: "جميع المهام",
    accounts: "الحسابات",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",

    // Authentication
    welcome: "مرحباً",
    loginDescription: "سجل دخولك للمتابعة",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    magicLink: "رابط سحري",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    passwordPlaceholder: "أدخل كلمة المرور",
    sendMagicLink: "إرسال رابط سحري",
    accessDenied: "تم رفض الوصول",
    accessDeniedDescription: "ليس لديك صلاحية للوصول إلى هذه الصفحة.",
    backToDashboard: "العودة للوحة التحكم",

    // Dashboard
    welcomeBack: "مرحباً بعودتك",
    totalTasks: "إجمالي المهام",
    completedTasks: "المهام المكتملة",
    pendingTasks: "المهام المعلقة",
    totalAccounts: "إجمالي الحسابات",
    recentTasks: "المهام الحديثة",
    taskDistribution: "توزيع المهام",
    accountsOverview: "نظرة عامة على الحسابات",

    // Tasks
    newTask: "مهمة جديدة",
    editTask: "تعديل المهمة",
    taskTitle: "عنوان المهمة",
    taskDescription: "وصف المهمة",
    status: "الحالة",
    priority: "الأولوية",
    assignedTo: "مُسند إلى",
    dueDate: "تاريخ الاستحقاق",
    attachments: "المرفقات",
    createTask: "إنشاء مهمة",
    updateTask: "تحديث المهمة",
    deleteTask: "حذف المهمة",

    // Status
    pending: "معلق",
    inProgress: "قيد التنفيذ",
    completed: "مكتمل",

    // Priority
    low: "منخفض",
    medium: "متوسط",
    high: "عالي",

    // File Upload
    dragDropFiles: "اسحب وأفلت الملفات هنا",
    dropFilesHere: "أفلت الملفات هنا",
    orClickToSelect: "أو انقر لاختيار الملفات",
    selectFiles: "اختر الملفات",
    maxFiles: "الحد الأقصى للملفات",
    maxSize: "الحد الأقصى للحجم",
    uploading: "جاري الرفع",
    uploadedFiles: "الملفات المرفوعة",
    image: "صورة",

    // Common
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    view: "عرض",
    search: "بحث",
    filter: "تصفية",
    actions: "الإجراءات",
    loading: "جاري التحميل...",
    noData: "لا توجد بيانات متاحة",

    // Theme
    light: "فاتح",
    dark: "داكن",
    system: "النظام",

    // Language
    english: "English",
    arabic: "العربية",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const value = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: language === "ar",
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
