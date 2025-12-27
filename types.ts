
export type UserRole = 'student' | 'parent' | 'teacher' | 'admin' | 'guest' | 'creator';
export type Region = 'nepal' | 'global';

export interface Institute {
  id: string;
  name: string;
  type: 'school' | 'college' | 'university';
  location: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  department: string;
  instituteId: string;
  avatar?: string;
}

export interface CourseCreator {
  id: string;
  name: string;
  bio: string;
  expertise: string[];
  rating: number;
  totalStudents: number;
  isVerified: boolean;
  bankLinked: boolean;
  walletProvider?: 'eSewa' | 'Khalti' | 'ConnectIPS';
  earningsTotal: number;
}

export interface Consultancy {
  id: string;
  name: string;
  location: string;
  specialization: string[]; // IELTS, GRE, Visa, etc.
  trustScore: number; // 0-100
  reviewCount: number;
  successRate: string;
  isVerified: boolean;
  services: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'class' | 'meeting' | 'office-hours' | 'personal';
  facultyId: string;
}

export interface MediaReview {
  type: 'image' | 'audio' | 'video';
  url: string;
  thumbnail?: string;
}

export interface Review {
  id: string;
  author: string;
  role: 'student' | 'parent' | 'creator';
  rating: number;
  comment: string;
  tags: string[];
  isVerified: boolean;
  date: string;
  instituteId?: string;
  consultancyId?: string;
  media?: MediaReview[];
}

export interface Workshop {
  id: string;
  title: string;
  category: 'life-skill' | 'business' | 'arts' | 'tech' | 'cyber';
  description: string;
  rating: number;
  reviewCount: number;
  price: string;
  nextSession: string;
}

export interface StudentResume {
  bio: string;
  education: string[];
  skills: string[];
  projects: string[];
  awards: string[];
}

export interface AppProject {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  features: string[];
  techStack: string[];
  status: 'draft' | 'planning' | 'visualizing' | 'active';
  imageUrl?: string;
}

export interface Scholarship {
  id: string;
  instituteId: string;
  name: string;
  amount: string;
  requirement: string;
  deadline: string;
  status?: string;
}

export interface AcademicRecord {
  id: string;
  studentName: string;
  subject: string;
  grade: string;
  homework: string;
  progress: number;
  nextMeeting?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  category: 'tech' | 'education' | 'career' | 'productivity';
  readTime: string;
  imageUrl: string;
}

export interface FeeTransaction {
  id: string;
  item: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'late';
  category: 'tuition' | 'lab' | 'events' | 'other';
}

export interface FeeSummary {
  totalDue: number;
  paidAmount: number;
  nextDeadline: string;
  scholarshipDeduction: number;
}

export interface StudentReport {
  studentId: string;
  studentName: string;
  writing: number;
  reading: number;
  research: number;
  lab: number;
  quizzes: number;
  feedback?: string;
}

export interface Classroom {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  schedule: string;
  timeframe: 'year' | 'semester' | 'month' | 'week';
}

export enum EduView {
  DASHBOARD = 'dashboard',
  COMMUNITY = 'community',
  SCHOLARSHIPS = 'scholarships',
  ACADEMICS = 'academics',
  TEACHER_PORTAL = 'teacher_portal',
  AI_ADVISOR = 'ai_advisor',
  WORKSHOPS = 'workshops',
  RESUME = 'resume',
  PROJECT_LAB = 'project_lab',
  BLOGS = 'blogs',
  FINANCE = 'finance',
  ABROAD_HUB = 'abroad_hub'
}
