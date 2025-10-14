// response type -> ~data
// props type -> ~props

export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T | null;
}
export interface AuthData {
  id: number;
  email: string;
  name: string;
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface OAuthData {
  id: number;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
  isNewUser: boolean;
  phoneNumber: string | null;
}

export interface CreateBookPageProps {
  title: string;
  originalText: string;
  targetAge: number;
  theme: string;
  style: string;
  voiceModel?: string;
  ttsSpeed?: number;
}

export interface CreateBookData {
  bookId: string;
  status: BookStatus;
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
  visibility: 'PRIVATE' | 'PUBLIC';
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
  visibility: 'PRIVATE' | 'PUBLIC';
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

export interface RecentBooksData {
  bookId: string;
  title: string;
  status: BookStatus;
  targetAge: number;
  thumbnailUrl: string;
  createdAt: string;
  viewedAt: string;
}

export interface UserProfileData {
  id: number;
  email: string;
  name: string;
  phoneNumber: string | null;
  provider: string;
  role: string;
  status: string;
  createdAt: string;
  canCreateBookToday: boolean;
  todayBookCreatedAt: string | null;
  voicePreference: string;
  ttsSpeed: number;
}

export interface LibraryBookListData {
  posts: LibraryBooksData[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface LibraryBooksData {
  postId: number;
  title: string;
  content: string;
  authorName: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  book: {
    bookId: string;
    originalTitle: string;
    thumbnailUrl: string;
    targetAge: number;
    theme: string;
    style: string;
  };
  averageRating?: number;
  reviewCount: number;
}

export interface LibraryDetailBookData {
  postId: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  book: {
    bookId: string;
    originalTitle: string;
    thumbnailUrl: string;
    targetAge: number;
    totalPages: number;
    theme: BookTheme;
    style: BookStyle;
  };
  averageRating?: number;
  reviewCount: number;
}

export interface PostDetailData {
  postId: number;
  bookId: string;
  title: string;
  content: string;
  authorName: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListData {
  bookInfo: {
    bookId: string;
    title: string;
    averageRating: number;
    reviewCount: number;
  };
  reviews: ReviewData[];
  pageInfo: {
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    isFirst: boolean;
    isLast: boolean;
  };
}
export interface ReviewData {
  reviewId: number;
  rating: number;
  comment: string;
  authorName: string;
  reviewerId: number;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LikeData {
  postId: number;
  isLiked: boolean;
  likeCount: number;
  action: string;
}

export interface MyReviewData {
  reviewId: number;
  postId: number;
  bookTitle: string;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface MyReviewsListData {
  reviews: MyReviewData[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isFirst: number;
  isLast: number;
}

export interface MyBookMarkedPostsListData {
  bookmarks: BookMarkedData[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLast: boolean;
  isFirst: boolean;
}

export interface BookMarkedData {
  bookMarkId: number;
  postId: number;
  postTitle: string;
  thumbnailUrl: string;
  bookMarkedAt: string;
  post: {
    postId: number;
    title: string;
    content: string;
    authorId: number;
    authorName: string;
    viewCount: number;
    likeCount: number;
    createdAt: string;
    book: {
      bookId: string;
      originalTitle: string;
      thumbnailUrl: string;
      targetAge: number;
      theme: BookTheme;
      style: BookStyle;
      totalPages: number;
    };
    averageRating?: number;
    reviewCount: number;
  };
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
