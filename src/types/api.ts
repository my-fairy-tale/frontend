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
  theme: BookTheme;
  style: BookStyle;
  status: BookStatus;
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
  targetAge: number;
  theme: BookTheme;
  style: BookStyle;
  status: BookStatus;
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

export enum BookStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum BookTheme {
  ADVENTURE = 'ADVENTURE',
  FRIENDSHIP = 'FRIENDSHIP',
  LEARNING = 'LEARNING',
  FANTASY = 'FANTASY',
}

export enum BookStyle {
  CARTOON = 'CARTOON',
  REALISTIC = 'REALISTIC',
  WATERCOLOR = 'WATERCOLOR',
  SKETCH = 'SKETCH',
}

// 한국어 라벨 매핑
export const BookThemeLabels = {
  [BookTheme.ADVENTURE]: '모험',
  [BookTheme.FRIENDSHIP]: '우정',
  [BookTheme.LEARNING]: '학습',
  [BookTheme.FANTASY]: '판타지',
};

export const BookStyleLabels = {
  [BookStyle.CARTOON]: '만화체',
  [BookStyle.REALISTIC]: '사실적',
  [BookStyle.WATERCOLOR]: '수채화',
  [BookStyle.SKETCH]: '스케치',
};
