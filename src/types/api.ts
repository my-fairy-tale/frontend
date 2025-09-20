// response type -> ~data
// props type -> ~props

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T | null;
}
export interface AuthData {
  accessToken: string;
  //refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface CreateBookPageProps {
  title: string;
  originalText: string;
  targetAge: number;
  theme: string;
  style: string;
}

export interface CreateBookData {
  bookId: string;
  status: string;
  estimatedCompletionMinutes: string;
}

export interface BookPage {
  createdAt: string;
  updatedAt: string;
  id: number;
  book: string;
  pageNumber: number;
  content: string;
  imagePath: string;
  imageUrl: string;
  imagePrompt: string;
  audioUrl: string;
}

export interface AudioFile {
  id: number;
  filePath: string;
  fileUrl: string;
  duration: number;
  filsSize: number;
  ttsprovider: string;
}

export interface BookData {
  id: string;
  title: string;
  originalText: string;
  targetAge: number;
  theme: string;
  style: string;
  status: string;
  progress: number;
  currentStep: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string;
  pages: BookPage[];
  audioFiles: AudioFile[];
}

export interface BookSummary {
  id: string;
  title: string;
  status: string;
  targetAge: number;
  theme: string;
  style: string;
  progress: number;
  createdAt: string;
  completedAt: string | null;
  thumbnailUrl: string;
}

export interface MyBooksData {
  books: BookSummary[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface UserProfileData {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  provider: string;
  role: string;
  status: string;
  createdAt: string;
}
