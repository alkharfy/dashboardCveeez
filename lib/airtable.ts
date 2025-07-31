// Airtable integration utilities
// In a real application, you would use environment variables for API keys

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

interface AirtableRecord {
  id: string
  fields: Record<string, any>
  createdTime: string
}

interface AirtableResponse {
  records: AirtableRecord[]
  offset?: string
}

class AirtableService {
  private baseUrl: string

  constructor() {
    this.baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`)
    }

    return response.json()
  }

  // Tasks operations
  async getTasks(filterByFormula?: string): Promise<AirtableRecord[]> {
    const params = new URLSearchParams()
    if (filterByFormula) {
      params.append("filterByFormula", filterByFormula)
    }

    const response: AirtableResponse = await this.request(`/Tasks?${params}`)
    return response.records
  }

  async getTask(id: string): Promise<AirtableRecord> {
    return this.request(`/Tasks/${id}`)
  }

  async createTask(fields: Record<string, any>): Promise<AirtableRecord> {
    return this.request("/Tasks", {
      method: "POST",
      body: JSON.stringify({ fields }),
    })
  }

  async updateTask(id: string, fields: Record<string, any>): Promise<AirtableRecord> {
    return this.request(`/Tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ fields }),
    })
  }

  async deleteTask(id: string): Promise<void> {
    await this.request(`/Tasks/${id}`, {
      method: "DELETE",
    })
  }

  // Users operations
  async getUsers(): Promise<AirtableRecord[]> {
    const response: AirtableResponse = await this.request("/Users")
    return response.records
  }

  async updateUser(id: string, fields: Record<string, any>): Promise<AirtableRecord> {
    return this.request(`/Users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ fields }),
    })
  }

  // Accounts operations
  async getAccounts(): Promise<AirtableRecord[]> {
    const response: AirtableResponse = await this.request("/Accounts")
    return response.records
  }

  async createAccount(fields: Record<string, any>): Promise<AirtableRecord> {
    return this.request("/Accounts", {
      method: "POST",
      body: JSON.stringify({ fields }),
    })
  }

  async updateAccount(id: string, fields: Record<string, any>): Promise<AirtableRecord> {
    return this.request(`/Accounts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ fields }),
    })
  }

  async deleteAccount(id: string): Promise<void> {
    await this.request(`/Accounts/${id}`, {
      method: "DELETE",
    })
  }
}

export const airtable = new AirtableService()

// Helper functions for data transformation
export const transformTaskRecord = (record: AirtableRecord) => ({
  id: record.id,
  clientName: record.fields["Client Name"],
  birthdate: record.fields["Birthdate"],
  contactInfo: record.fields["Contact Info"],
  address: record.fields["Address"],
  jobTitle: record.fields["Job Title"],
  education: record.fields["Education"],
  experience: record.fields["Years of Experience"],
  skills: record.fields["Skills"],
  requiredServices: record.fields["Required Services"] || [],
  designerNotes: record.fields["Designer Notes"],
  reviewerNotes: record.fields["Reviewer Notes"],
  paymentStatus: record.fields["Payment Status"],
  status: record.fields["Status"],
  date: record.fields["Date"],
  designerRating: record.fields["Designer Rating"] || 0,
  reviewerRating: record.fields["Reviewer Rating"] || 0,
  designerFeedback: record.fields["Designer Feedback"],
  reviewerFeedback: record.fields["Reviewer Feedback"],
  assignedDesigner: record.fields["Assigned Designer"],
  assignedReviewer: record.fields["Assigned Reviewer"],
  attachments: record.fields["Attachments"] || [],
  createdTime: record.createdTime,
})

export const transformUserRecord = (record: AirtableRecord) => ({
  id: record.id,
  name: record.fields["Name"],
  email: record.fields["Email"],
  role: record.fields["Role"],
  status: record.fields["Status"],
  workplace: record.fields["Workplace"],
  createdTime: record.createdTime,
})

export const transformAccountRecord = (record: AirtableRecord) => ({
  id: record.id,
  serviceName: record.fields["Service Name"],
  username: record.fields["Username"],
  password: record.fields["Password"],
  notes: record.fields["Notes"],
  loginUrl: record.fields["Login URL"],
  createdTime: record.createdTime,
})
