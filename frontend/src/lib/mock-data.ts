export type CandidateStatus = "New" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  experience: number;
  matchScore: number;
  status: CandidateStatus;
  avatarInitials: string;
  skills: string[];
  appliedAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Contract" | "Part-time";
  experience: string;
  applicants: number;
  status: "Open" | "Draft" | "Closed";
  skills: string[];
  postedAt: string;
}

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: "Under review" | "Interview" | "Offer" | "Rejected";
  matchScore: number;
}

export const candidates: Candidate[] = [
  { id: "c1", name: "Aarav Sharma", email: "aarav@mail.com", role: "Senior Backend Engineer", location: "Bangalore, IN", experience: 6, matchScore: 94, status: "Interview", avatarInitials: "AS", skills: ["Node.js", "PostgreSQL", "Docker", "AWS", "TypeScript"], appliedAt: "2d ago" },
  { id: "c2", name: "Sofia Martinez", email: "sofia@mail.com", role: "Product Designer", location: "Berlin, DE", experience: 4, matchScore: 88, status: "Screening", avatarInitials: "SM", skills: ["Figma", "Design systems", "Prototyping"], appliedAt: "3d ago" },
  { id: "c3", name: "Liam O'Connor", email: "liam@mail.com", role: "Frontend Engineer", location: "Dublin, IE", experience: 3, matchScore: 82, status: "New", avatarInitials: "LO", skills: ["React", "TypeScript", "GraphQL"], appliedAt: "5h ago" },
  { id: "c4", name: "Priya Nair", email: "priya@mail.com", role: "Data Scientist", location: "Remote", experience: 5, matchScore: 91, status: "Offer", avatarInitials: "PN", skills: ["Python", "PyTorch", "SQL", "ML Ops"], appliedAt: "1w ago" },
  { id: "c5", name: "Marcus Chen", email: "marcus@mail.com", role: "DevOps Engineer", location: "Singapore", experience: 7, matchScore: 79, status: "Screening", avatarInitials: "MC", skills: ["Kubernetes", "Terraform", "AWS", "CI/CD"], appliedAt: "1d ago" },
  { id: "c6", name: "Emma Wilson", email: "emma@mail.com", role: "Engineering Manager", location: "London, UK", experience: 9, matchScore: 86, status: "Interview", avatarInitials: "EW", skills: ["Leadership", "Node.js", "System Design"], appliedAt: "4d ago" },
  { id: "c7", name: "Kenji Tanaka", email: "kenji@mail.com", role: "iOS Engineer", location: "Tokyo, JP", experience: 4, matchScore: 74, status: "Rejected", avatarInitials: "KT", skills: ["Swift", "SwiftUI", "Combine"], appliedAt: "2w ago" },
  { id: "c8", name: "Zara Ahmed", email: "zara@mail.com", role: "Senior Backend Engineer", location: "Dubai, AE", experience: 6, matchScore: 89, status: "New", avatarInitials: "ZA", skills: ["Go", "gRPC", "Kafka", "AWS"], appliedAt: "6h ago" },
];

export const jobs: Job[] = [
  { id: "j1", title: "Senior Backend Engineer", department: "Engineering", location: "Remote / Bangalore", type: "Full-time", experience: "5-8 yrs", applicants: 128, status: "Open", skills: ["Node.js", "PostgreSQL", "AWS", "Docker"], postedAt: "5d ago" },
  { id: "j2", title: "Product Designer", department: "Design", location: "Berlin", type: "Full-time", experience: "3-5 yrs", applicants: 74, status: "Open", skills: ["Figma", "Design systems"], postedAt: "1w ago" },
  { id: "j3", title: "Data Scientist", department: "Data", location: "Remote", type: "Full-time", experience: "4-6 yrs", applicants: 96, status: "Open", skills: ["Python", "ML", "SQL"], postedAt: "3d ago" },
  { id: "j4", title: "DevOps Engineer", department: "Platform", location: "Singapore", type: "Full-time", experience: "5+ yrs", applicants: 42, status: "Draft", skills: ["Kubernetes", "Terraform", "AWS"], postedAt: "2d ago" },
  { id: "j5", title: "Engineering Manager", department: "Engineering", location: "London", type: "Full-time", experience: "8+ yrs", applicants: 31, status: "Open", skills: ["Leadership", "System Design"], postedAt: "2w ago" },
  { id: "j6", title: "iOS Engineer", department: "Mobile", location: "Tokyo", type: "Full-time", experience: "3-5 yrs", applicants: 58, status: "Closed", skills: ["Swift", "SwiftUI"], postedAt: "1mo ago" },
];

export const applications: Application[] = [
  { id: "a1", jobTitle: "Senior Product Designer", company: "Linear", appliedAt: "2d ago", status: "Interview", matchScore: 91 },
  { id: "a2", jobTitle: "Frontend Engineer", company: "Stripe", appliedAt: "5d ago", status: "Under review", matchScore: 84 },
  { id: "a3", jobTitle: "Design Systems Lead", company: "Notion", appliedAt: "1w ago", status: "Offer", matchScore: 96 },
  { id: "a4", jobTitle: "UX Researcher", company: "Vercel", appliedAt: "3w ago", status: "Rejected", matchScore: 62 },
];

export const kpiTrend = [
  { month: "Jan", applicants: 120, hires: 8 },
  { month: "Feb", applicants: 180, hires: 12 },
  { month: "Mar", applicants: 220, hires: 15 },
  { month: "Apr", applicants: 260, hires: 18 },
  { month: "May", applicants: 310, hires: 22 },
  { month: "Jun", applicants: 380, hires: 27 },
];

export const skillDistribution = [
  { skill: "React", value: 42 },
  { skill: "Node.js", value: 38 },
  { skill: "Python", value: 34 },
  { skill: "AWS", value: 29 },
  { skill: "SQL", value: 25 },
  { skill: "Go", value: 14 },
];

export const recommendationDistribution = [
  { name: "Strong match", value: 42 },
  { name: "Good match", value: 78 },
  { name: "Fair", value: 54 },
  { name: "Low", value: 26 },
];

export const featureImportance = [
  { feature: "Skill overlap", value: 38 },
  { feature: "Years of experience", value: 22 },
  { feature: "Domain fit", value: 18 },
  { feature: "Education", value: 12 },
  { feature: "Location", value: 10 },
];
