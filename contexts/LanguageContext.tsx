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
  email: string
  password: string
  name: string
  emailPlaceholder: string
  passwordPlaceholder: string
  namePlaceholder: string
  sendMagicLink: string
  or: string
  loginSuccess: string
  loginError: string
  signupSuccess: string
  signupError: string
  magicLinkSent: string
  magicLinkError: string
  accessDenied: string
  unauthorizedMessage: string
  backToDashboard: string

  // Dashboard
  welcomeBack: string
  totalTasks: string
  pendingTasks: string
  completedTasks: string
  myTasks: string
  recentActivity: string
  quickStats: string
  taskDistribution: string
  monthlyProgress: string

  // Tasks
  newTask: string
  editTask: string
  taskDetails: string
  clientName: string
  birthdate: string
  contactInfo: string
  address: string
  jobTitle: string
  education: string
  experience: string
  skills: string
  services: string
  designerNotes: string
  reviewerNotes: string
  paymentStatus: string
  status: string
  priority: string
  date: string
  dueDate: string
  assignedDesigner: string
  assignedReviewer: string
  attachments: string

  // Task Status
  pending: string
  inProgress: string
  completed: string
  cancelled: string

  // Priority
  low: string
  medium: string
  high: string
  urgent: string

  // Payment Status
  unpaid: string
  partiallyPaid: string
  paid: string

  // Actions
  save: string
  cancel: string
  edit: string
  delete: string
  view: string
  assign: string
  submit: string
  update: string
  create: string
  search: string
  filter: string
  export: string
  import: string

  // File Upload
  dragDropFiles: string
  dropFiles: string
  supportedFormats: string
  maxFileSize: string
  maxFiles: string
  uploading: string
  uploadedFiles: string
  tooManyFiles: string
  uploadError: string

  // Common
  loading: string
  error: string
  success: string
  warning: string
  info: string
  yes: string
  no: string
  close: string
  open: string

  // Profile
  personalInfo: string
  changePassword: string
  preferences: string
  language: string
  theme: string
  light: string
  dark: string
  system: string

  // Accounts
  serviceName: string
  username: string
  loginUrl: string
  notes: string
  addAccount: string
  editAccount: string

  // Ratings
  rating: string
  feedback: string
  designerRating: string
  reviewerRating: string
  designerFeedback: string
  reviewerFeedback: string
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    tasks: "Tasks",
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
    email: "Email",
    password: "Password",
    name: "Name",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    namePlaceholder: "Enter your name",
    sendMagicLink: "Send Magic Link",
    or: "Or",
    loginSuccess: "Login successful",
    loginError: "Login failed",
    signupSuccess: "Account created successfully. Please check your email.",
    signupError: "Signup failed",
    magicLinkSent: "Magic link sent to your email",
    magicLinkError: "Failed to send magic link",
    accessDenied: "Access Denied",
    unauthorizedMessage: "You do not have permission to access this page.",
    backToDashboard: "Back to Dashboard",

    // Dashboard
    welcomeBack: "Welcome back",
    totalTasks: "Total Tasks",
    pendingTasks: "Pending Tasks",
    completedTasks: "Completed Tasks",
    myTasks: "My Tasks",
    recentActivity: "Recent Activity",
    quickStats: "Quick Stats",
    taskDistribution: "Task Distribution",
    monthlyProgress: "Monthly Progress",

    // Tasks
    newTask: "New Task",
    editTask: "Edit Task",
    taskDetails: "Task Details",
    clientName: "Client Name",
    birthdate: "Birthdate",
    contactInfo: "Contact Info",
    address: "Address",
    jobTitle: "Job Title",
    education: "Education",
    experience: "Experience",
    skills: "Skills",
    services: "Services",
    designerNotes: "Designer Notes",
    reviewerNotes: "Reviewer Notes",
    paymentStatus: "Payment Status",
    status: "Status",
    priority: "Priority",
    date: "Date",
    dueDate: "Due Date",
    assignedDesigner: "Assigned Designer",
    assignedReviewer: "Assigned Reviewer",
    attachments: "Attachments",

    // Task Status
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",

    // Priority
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",

    // Payment Status
    unpaid: "Unpaid",
    partiallyPaid: "Partially Paid",
    paid: "Paid",

    // Actions
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    assign: "Assign",
    submit: "Submit",
    update: "Update",
    create: "Create",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",

    // File Upload
    dragDropFiles: "Drag and drop files here, or click to select",
    dropFiles: "Drop files here",
    supportedFormats: "Supported formats",
    maxFileSize: "Max file size",
    maxFiles: "Max files",
    uploading: "Uploading",
    uploadedFiles: "Uploaded Files",
    tooManyFiles: "Too many files. Maximum {max} files allowed.",
    uploadError: "Upload failed",

    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
    yes: "Yes",
    no: "No",
    close: "Close",
    open: "Open",

    // Profile
    personalInfo: "Personal Information",
    changePassword: "Change Password",
    preferences: "Preferences",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",

    // Accounts
    serviceName: "Service Name",
    username: "Username",
    loginUrl: "Login URL",
    notes: "Notes",
    addAccount: "Add Account",
    editAccount: "Edit Account",

    // Ratings
    rating: "Rating",
    feedback: "Feedback",
    designerRating: "Designer Rating",
    reviewerRating: "Reviewer Rating",
    designerFeedback: "Designer Feedback",
    reviewerFeedback: "Reviewer Feedback",
  },
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    tasks: "المهام",
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
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    name: "الاسم",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    passwordPlaceholder: "أدخل كلمة المرور",
    namePlaceholder: "أدخل اسمك",
    sendMagicLink: "إرسال رابط سحري",
    or: "أو",
    loginSuccess: "تم تسجيل الدخول بنجاح",
    loginError: "فشل في تسجيل الدخول",
    signupSuccess: "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني.",
    signupError: "فشل في إنشاء الحساب",
    magicLinkSent: "تم إرسال الرابط السحري إلى بريدك الإلكتروني",
    magicLinkError: "فشل في إرسال الرابط السحري",
    accessDenied: "تم رفض الوصول",
    unauthorizedMessage: "ليس لديك صلاحية للوصول إلى هذه الصفحة.",
    backToDashboard: "العودة إلى لوحة التحكم",

    // Dashboard
    welcomeBack: "مرحباً بعودتك",
    totalTasks: "إجمالي المهام",
    pendingTasks: "المهام المعلقة",
    completedTasks: "المهام المكتملة",
    myTasks: "مهامي",
    recentActivity: "النشاط الأخير",
    quickStats: "إحصائيات سريعة",
    taskDistribution: "توزيع المهام",
    monthlyProgress: "التقدم الشهري",

    // Tasks
    newTask: "مهمة جديدة",
    editTask: "تعديل المهمة",
    taskDetails: "تفاصيل المهمة",
    clientName: "اسم العميل",
    birthdate: "تاريخ الميلاد",
    contactInfo: "معلومات الاتصال",
    address: "العنوان",
    jobTitle: "المسمى الوظيفي",
    education: "التعليم",
    experience: "الخبرة",
    skills: "المهارات",
    services: "الخدمات",
    designerNotes: "ملاحظات المصمم",
    reviewerNotes: "ملاحظات المراجع",
    paymentStatus: "حالة الدفع",
    status: "الحالة",
    priority: "الأولوية",
    date: "التاريخ",
    dueDate: "تاريخ الاستحقاق",
    assignedDesigner: "المصمم المكلف",
    assignedReviewer: "المراجع المكلف",
    attachments: "المرفقات",

    // Task Status
    pending: "معلق",
    inProgress: "قيد التنفيذ",
    completed: "مكتمل",
    cancelled: "ملغي",

    // Priority
    low: "منخفض",
    medium: "متوسط",
    high: "عالي",
    urgent: "عاجل",

    // Payment Status
    unpaid: "غير مدفوع",
    partiallyPaid: "مدفوع جزئياً",
    paid: "مدفوع",

    // Actions
    save: "حفظ",
    cancel: "إلغاء",
    edit: "تعديل",
    delete: "حذف",
    view: "عرض",
    assign: "تكليف",
    submit: "إرسال",
    update: "تحديث",
    create: "إنشاء",
    search: "بحث",
    filter: "تصفية",
    export: "تصدير",
    import: "استيراد",

    // File Upload
    dragDropFiles: "اسحب وأفلت الملفات هنا، أو انقر للاختيار",
    dropFiles: "أفلت الملفات هنا",
    supportedFormats: "التنسيقات المدعومة",
    maxFileSize: "الحد الأقصى لحجم الملف",
    maxFiles: "الحد الأقصى للملفات",
    uploading: "جاري الرفع",
    uploadedFiles: "الملفات المرفوعة",
    tooManyFiles: "ملفات كثيرة جداً. الحد الأقصى {max} ملفات.",
    uploadError: "فشل في الرفع",

    // Common
    loading: "جاري التحميل...",
    error: "خطأ",
    success: "نجح",
    warning: "تحذير",
    info: "معلومات",
    yes: "نعم",
    no: "لا",
    close: "إغلاق",
    open: "فتح",

    // Profile
    personalInfo: "المعلومات الشخصية",
    changePassword: "تغيير كلمة المرور",
    preferences: "التفضيلات",
    language: "اللغة",
    theme: "المظهر",
    light: "فاتح",
    dark: "داكن",
    system: "النظام",

    // Accounts
    serviceName: "اسم الخدمة",
    username: "اسم المستخدم",
    loginUrl: "رابط تسجيل الدخول",
    notes: "ملاحظات",
    addAccount: "إضافة حساب",
    editAccount: "تعديل الحساب",

    // Ratings
    rating: "التقييم",
    feedback: "التعليقات",
    designerRating: "تقييم المصمم",
    reviewerRating: "تقييم المراجع",
    designerFeedback: "تعليقات المصمم",
    reviewerFeedback: "تعليقات المراجع",
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

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }

  const value = {
    language,
    setLanguage: handleSetLanguage,
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
