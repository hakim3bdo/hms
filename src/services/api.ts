import axios from 'axios';

/**
 * API Service Module
 * 
 * Centralized API client connecting to the external Housing Management API
 * Base URL: http://housingms.runasp.net
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.warn('NEXT_PUBLIC_API_URL environment variable is not set. API calls will fail.');
}

/**
 * Utility function to clean and validate national ID
 * @param nationalId - The raw national ID input
 * @returns Cleaned national ID (only digits)
 */
export const cleanNationalId = (nationalId: string | null | undefined): string | null => {
  if (!nationalId) return null;
  return nationalId.trim().replace(/\D/g, '');
};

/**
 * Utility function to validate national ID (must be exactly 14 digits)
 * @param nationalId - The cleaned national ID
 * @returns Whether the national ID is valid
 */
export const isValidNationalId = (nationalId: string | null): nationalId is string => {
  return !!nationalId && nationalId.length === 14;
};

/**
 * Utility function to extract array from API response
 */
export const extractArray = (response: unknown): unknown[] => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  
  const res = response as Record<string, unknown>;
  if (Array.isArray(res?.data)) return res.data;
  if (res?.data && Array.isArray((res.data as Record<string, unknown>)?.data)) {
    return (res.data as Record<string, unknown>).data as unknown[];
  }
  if (res?.id || res?.name || res?.title) return [response];
  return [];
};

/**
 * Utility function to extract object from API response
 */
export const extractObject = (response: unknown): Record<string, unknown> => {
  if (!response) return {};
  if (typeof response === 'object' && !Array.isArray(response)) {
    const res = response as Record<string, unknown>;
    if (res?.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
      return res.data as Record<string, unknown>;
    }
    const data = res?.data as Record<string, unknown> | undefined;
    if (data?.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
      return data.data as Record<string, unknown>;
    }
    return res;
  }
  return {};
};

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication API
 */
export const authAPI = {
  /**
   * Register a new student
   */
  register: async (data: {
    userName: string;
    password: string;
    role?: string;
    studentId?: number;
  }) => {
    const response = await apiClient.post('/api/student/auth/register', {
      userName: data.userName,
      password: data.password,
      role: data.role || 'student',
      studentId: data.studentId,
    });
    return response.data;
  },

  /**
   * Login user
   */
  login: async (username: string, password: string) => {
    const response = await apiClient.post('/api/student/auth/login', {
      username,
      password,
    });
    
    if (typeof window !== 'undefined') {
      // Store token if returned (check common response formats)
      const token = response.data?.token || response.data?.accessToken || response.data?.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      
      // Store user if returned, or create a basic user object
      const userData = response.data?.user || response.data?.data?.user || response.data;
      if (userData) {
        // Create a user object with available data
        const user = {
          id: userData.id || userData.userId || userData.studentId,
          username: userData.username || userData.userName || username,
          fullName: userData.fullName || userData.name || userData.studentName,
          email: userData.email,
          role: userData.role || 'student',
          studentId: userData.studentId,
          nationalId: userData.nationalId,
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return { success: true };
  },

  /**
   * Get token from localStorage
   */
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  /**
   * Get current user from stored data
   */
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated (token exists)
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    return !!token;
  },
};

/**
 * Student Profile API
 */
export const studentProfileAPI = {
  /**
   * Get student profile details
   */
  getProfile: async (studentId?: string) => {
    try {
      const endpoint = studentId 
        ? `/api/Student/${studentId}` 
        : '/api/student/profile/details';
      
      const response = await apiClient.get(endpoint);
      return extractObject(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      return {};
    }
  },

  /**
   * Get student notifications
   */
  getNotifications: async (studentId?: string) => {
    try {
      const endpoint = studentId
        ? `/api/Student/${studentId}/Notifications`
        : '/api/student/profile/notifications';
        
      const response = await apiClient.get(endpoint);
      return extractArray(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  /**
   * Mark notification as read
   */
  markNotificationAsRead: async (notificationId: string) => {
    try {
      const response = await apiClient.put(
        `/api/student/profile/notifications/${notificationId}/read`,
        {}
      );
      return response.data || {};
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {};
    }
  },

  /**
   * Get student fees
   */
  getFees: async (studentId?: string) => {
    try {
      const endpoint = studentId
        ? `/api/Student/${studentId}/Fees`
        : '/api/student/profile/fees';
        
      const response = await apiClient.get(endpoint);
      return extractArray(response.data);
    } catch (error) {
      console.error('Error fetching fees:', error);
      return [];
    }
  },

  /**
   * Get student room assignments
   */
  getAssignments: async (studentId?: string) => {
    try {
      const endpoint = studentId
        ? `/api/Student/${studentId}/Assignment`
        : '/api/student/profile/assignments';
        
      const response = await apiClient.get(endpoint);
      return extractArray(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      return [];
    }
  },
};

/**
 * Student Payments API
 */
export const studentPaymentsAPI = {
  /**
   * Get student fees/payments
   */
  getFees: async (studentId?: string) => {
    try {
      const endpoint = studentId
        ? `/api/Student/${studentId}/Fees`
        : '/api/student/profile/fees';
      const response = await apiClient.get(endpoint);
      return extractArray(response.data);
    } catch (error) {
      console.error('Error fetching fees:', error);
      return [];
    }
  },

  /**
   * Make a payment
   */
  makePayment: async (paymentData: {
    feeId: string;
    studentId: string;
    transactionCode: string;
    receiptFilePath?: string;
  }) => {
    const endpoint = `/api/student/payments/pay/${paymentData.feeId}`;
    const payload = {
      studentId: paymentData.studentId,
      transactionCode: paymentData.transactionCode,
      receiptFilePath: paymentData.receiptFilePath || null,
    };
    
    const response = await apiClient.post(endpoint, payload);
    return extractObject(response.data);
  },

  /**
   * Get payment history
   */
  getPaymentHistory: async (studentId?: string) => {
    try {
      const endpoint = studentId
        ? `/api/Student/${studentId}/Payments`
        : '/api/student/payments';
      const response = await apiClient.get(endpoint);
      return extractArray(response.data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  },
};

/**
 * Student Complaints API
 */
export const studentComplaintsAPI = {
  /**
   * Get all student complaints
   */
  getComplaints: async () => {
    try {
      const response = await apiClient.get('/api/student/complaints');
      return extractArray(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      return [];
    }
  },

  /**
   * Submit a new complaint
   */
  submitComplaint: async (title: string, message: string) => {
    const response = await apiClient.post('/api/student/complaints/submit', {
      title,
      message,
    });
    return response.data || {};
  },
};

/**
 * Contact Info interface for father and guardian
 */
interface ContactInfo {
  contactId?: number;
  fullName: string;
  nationalId: string;
  relation?: string;
  job: string;
  phoneNumber: string;
  address: string;
}

/**
 * Student Info interface
 */
interface StudentInfo {
  studentId?: number;
  nationalId: string;
  fullName: string;
  studentType?: number;
  birthDate: string;
  birthPlace: string;
  gender: string;
  religion: string;
  governorate: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  faculty: string;
  department: string;
  level: string;
  fatherContactId?: number;
  guardianContactId?: number;
  userId?: number;
}

/**
 * Secondary Info interface (for new students)
 */
interface SecondaryInfo {
  studentId?: number;
  secondaryStream: string;
  totalScore: number;
  percentage: number;
  grade: string;
}

/**
 * Academic Info interface (for old students)
 */
interface AcademicInfo {
  studentId?: number;
  currentGPA: number;
  lastYearGrade: string;
}

/**
 * Application submission data interface
 */
interface ApplicationSubmissionData {
  studentType: number;
  studentInfo: StudentInfo;
  fatherInfo: ContactInfo;
  selectedGuardianRelation: string;
  otherGuardianInfo?: ContactInfo;
  secondaryInfo?: SecondaryInfo;
  academicInfo?: AcademicInfo;
}

/**
 * Application API
 */
export const applicationAPI = {
  /**
   * Submit a new housing application
   */
  submitApplication: async (applicationData: ApplicationSubmissionData) => {
    const payload: ApplicationSubmissionData = {
      studentType: applicationData.studentType,
      studentInfo: {
        studentId: applicationData.studentInfo.studentId || 0,
        nationalId: cleanNationalId(applicationData.studentInfo.nationalId) || '',
        fullName: applicationData.studentInfo.fullName,
        studentType: applicationData.studentType,
        birthDate: applicationData.studentInfo.birthDate,
        birthPlace: applicationData.studentInfo.birthPlace,
        gender: applicationData.studentInfo.gender,
        religion: applicationData.studentInfo.religion,
        governorate: applicationData.studentInfo.governorate,
        city: applicationData.studentInfo.city,
        address: applicationData.studentInfo.address,
        email: applicationData.studentInfo.email,
        phone: applicationData.studentInfo.phone,
        faculty: applicationData.studentInfo.faculty,
        department: applicationData.studentInfo.department,
        level: applicationData.studentInfo.level,
        fatherContactId: applicationData.studentInfo.fatherContactId || 0,
        guardianContactId: applicationData.studentInfo.guardianContactId || 0,
        userId: applicationData.studentInfo.userId || 0,
      },
      fatherInfo: {
        contactId: applicationData.fatherInfo.contactId || 0,
        fullName: applicationData.fatherInfo.fullName,
        nationalId: cleanNationalId(applicationData.fatherInfo.nationalId) || '',
        relation: applicationData.fatherInfo.relation || 'father',
        job: applicationData.fatherInfo.job,
        phoneNumber: applicationData.fatherInfo.phoneNumber,
        address: applicationData.fatherInfo.address,
      },
      selectedGuardianRelation: applicationData.selectedGuardianRelation,
    };

    // Add other guardian info if guardian is not father
    if (applicationData.selectedGuardianRelation !== 'father' && applicationData.otherGuardianInfo) {
      payload.otherGuardianInfo = {
        contactId: applicationData.otherGuardianInfo.contactId || 0,
        fullName: applicationData.otherGuardianInfo.fullName,
        nationalId: cleanNationalId(applicationData.otherGuardianInfo.nationalId) || '',
        relation: applicationData.otherGuardianInfo.relation || applicationData.selectedGuardianRelation,
        job: applicationData.otherGuardianInfo.job,
        phoneNumber: applicationData.otherGuardianInfo.phoneNumber,
        address: applicationData.otherGuardianInfo.address,
      };
    }

    // Add secondary info for new students (studentType = 0)
    if (applicationData.studentType === 0 && applicationData.secondaryInfo) {
      payload.secondaryInfo = {
        studentId: applicationData.secondaryInfo.studentId || 0,
        secondaryStream: applicationData.secondaryInfo.secondaryStream,
        totalScore: Number(applicationData.secondaryInfo.totalScore),
        percentage: Number(applicationData.secondaryInfo.percentage),
        grade: applicationData.secondaryInfo.grade,
      };
    }

    // Add academic info for old students (studentType = 1)
    if (applicationData.studentType === 1 && applicationData.academicInfo) {
      payload.academicInfo = {
        studentId: applicationData.academicInfo.studentId || 0,
        currentGPA: Number(applicationData.academicInfo.currentGPA),
        lastYearGrade: applicationData.academicInfo.lastYearGrade,
      };
    }
    
    const response = await apiClient.post('/api/student/applications/submit', payload);
    
    if (response.data?.data) {
      return response.data.data;
    }
    return response.data || {};
  },

  /**
   * Get my applications
   */
  getMyApplications: async () => {
    try {
      const response = await apiClient.get('/api/student/applications/my-applications');
      return extractArray(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  },

  /**
   * Search for application by national ID
   */
  searchByNationalId: async (nationalId: string): Promise<unknown[]> => {
    const cleanedNationalId = cleanNationalId(nationalId);
    
    if (!isValidNationalId(cleanedNationalId)) {
      throw new Error('الرقم القومي يجب أن يكون 14 رقم');
    }

    const endpoint = `/api/Application/SearchByNationalId/${cleanedNationalId}`;
    const response = await apiClient.get(endpoint);
    
    const data = extractArray(response.data);
    if (data && data.length > 0) {
      return data;
    }
    
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      return [response.data];
    }
    
    return [];
  },

  /**
   * Get application status by national ID
   */
  getApplicationStatus: async (nationalId: string) => {
    const applications = await applicationAPI.searchByNationalId(nationalId);
    if (applications.length === 0) {
      return null;
    }
    const sorted = [...applications].sort((a, b) => {
      const appA = a as Record<string, unknown>;
      const appB = b as Record<string, unknown>;
      const dateA = new Date((appA.submittedAt || appA.createdAt || appA.date || 0) as string).getTime();
      const dateB = new Date((appB.submittedAt || appB.createdAt || appB.date || 0) as string).getTime();
      return dateB - dateA;
    });
    return sorted[0];
  },
};

// Default export
export default {
  auth: authAPI,
  profile: studentProfileAPI,
  payments: studentPaymentsAPI,
  complaints: studentComplaintsAPI,
  applications: applicationAPI,
};
