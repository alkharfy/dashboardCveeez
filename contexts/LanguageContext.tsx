"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "ar" | "en"

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const translations = {
  // Navigation
  dashboard: { ar: "لوحة المعلومات", en: "Dashboard" },
  myTasks: { ar: "مهامي", en: "My Tasks" },
  allTasks: { ar: "جميع المهام", en: "All Tasks" },
  newTask: { ar: "مهمة جديدة", en: "New Task" },
  accounts: { ar: "الحسابات", en: "Accounts" },
  profile: { ar: "الملف الشخصي", en: "Profile" },

  // Common
  save: { ar: "حفظ", en: "Save" },
  cancel: { ar: "إلغاء", en: "Cancel" },
  edit: { ar: "تعديل", en: "Edit" },
  delete: { ar: "حذف", en: "Delete" },
  add: { ar: "إضافة", en: "Add" },
  search: { ar: "بحث", en: "Search" },
  filter: { ar: "تصفية", en: "Filter" },
  export: { ar: "تصدير", en: "Export" },

  // Task fields
  clientName: { ar: "اسم العميل", en: "Client Name" },
  birthdate: { ar: "تاريخ الميلاد", en: "Birthdate" },
  contactInfo: { ar: "وسائل التواصل", en: "Contact Info" },
  address: { ar: "العنوان", en: "Address" },
  jobTitle: { ar: "الوظيفة", en: "Job Title" },
  education: { ar: "التعليم", en: "Education" },
  experience: { ar: "سنوات الخبرة", en: "Years of Experience" },
  skills: { ar: "المهارات", en: "Skills" },
  requiredServices: { ar: "الخدمات المطلوبة", en: "Required Services" },
  designerNotes: { ar: "ملاحظات للمصمم", en: "Designer Notes" },
  reviewerNotes: { ar: "ملاحظات للمراجع", en: "Reviewer Notes" },
  paymentStatus: { ar: "حالة الدفع", en: "Payment Status" },
  attachments: { ar: "الملفات المرفقة", en: "Attachments" },

  // Status
  pending: { ar: "قيد الانتظار", en: "Pending" },
  inProgress: { ar: "قيد التنفيذ", en: "In Progress" },
  inReview: { ar: "في المراجعة", en: "In Review" },
  completed: { ar: "مكتمل", en: "Completed" },

  // Payment
  paid: { ar: "مدفوع", en: "Paid" },
  unpaid: { ar: "غير مدفوع", en: "Unpaid" },

  // Roles
  admin: { ar: "مشرف", en: "Admin" },
  designer: { ar: "مصمم", en: "Designer" },
  reviewer: { ar: "مراجع", en: "Reviewer" },
  manager: { ar: "مدير", en: "Manager" },

  // Dashboard
  totalTasks: { ar: "إجمالي المهام", en: "Total Tasks" },
  completedTasks: { ar: "المهام المكتملة", en: "Completed Tasks" },
  pendingTasks: { ar: "المهام المعلقة", en: "Pending Tasks" },
  avgRating: { ar: "متوسط التقييم", en: "Average Rating" },

  // Services
  cvWriting: { ar: "كتابة السيرة الذاتية", en: "CV Writing" },
  coverLetter: { ar: "خطاب التغطية", en: "Cover Letter" },
  linkedinProfile: { ar: "ملف لينكدإن", en: "LinkedIn Profile" },

  // Messages
  noTasks: { ar: "لا توجد مهام حالياً", en: "No tasks available" },
  taskSaved: { ar: "تم حفظ المهمة بنجاح", en: "Task saved successfully" },
  taskDeleted: { ar: "تم حذف المهمة", en: "Task deleted" },

  // Rating
  designerRating: { ar: "تقييم المصمم", en: "Designer Rating" },
  reviewerRating: { ar: "تقييم المراجع", en: "Reviewer Rating" },
  feedback: { ar: "التعليقات", en: "Feedback" },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("ar")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang) {
      setLang(savedLang)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", lang)
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }, [lang])

  const t = (key: string): string => {
    return translations[key as keyof typeof translations]?.[lang] || key
  }

  const isRTL = lang === "ar"

  return <LanguageContext.Provider value={{ lang, setLang, t, isRTL }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
