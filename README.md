# 📚 My Fairy Tale

An AI-powered platform for creating and sharing personalized fairy tales with images and voice narration.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://dreamteller-pi.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🌐 **Live Demo**: [https://dreamteller-pi.vercel.app/](https://dreamteller-pi.vercel.app/)

## ✨ Features

### 📖 AI Story Generation
- Generate personalized fairy tales using GPT
- Customize story themes, age targets, and art styles
- Automatic page splitting and story formatting

### 🎨 AI Image Generation
- Beautiful illustrations powered by DALL-E
- Multiple art styles: Cartoon, Realistic, Watercolor, Sketch
- Unique images for each page of your story

### 🔊 Text-to-Speech
- Natural voice narration using OpenAI TTS
- Multiple voice models to choose from (Alloy, Echo, Fable, Nova, Shimmer, etc.)
- Adjustable speech speed (0.5x - 2.0x)
- Save voice preferences for future books

### 👥 Community Features
- **Library**: Share your stories with the community
- **Reviews & Ratings**: Rate and review other users' fairy tales
- **Likes**: Show appreciation for great stories
- **Public/Private Toggle**: Control who can see your books

### 🔐 User Management
- Secure authentication with NextAuth
- Profile customization
- Voice preference settings
- Account management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5 (App Router)
- **Language**: TypeScript
- **UI**: React 19, TailwindCSS 4
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: NextAuth v5
- **Icons**: React Icons
- **Font**: Pretendard Variable

### Backend
- Backend repository: [my-fairy-tale/backend](https://github.com/my-fairy-tale/backend)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Yarn 4.9.3+

### Installation

1. Clone the repository
```bash
git clone https://github.com/my-fairy-tale/frontend.git
cd frontend
```

2. Install dependencies
```bash
yarn install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=your_backend_api_url

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
AUTH_SECRET=your_auth_secret
```

4. Run the development server
```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
yarn build
yarn start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── books/             # Book creation and viewing
│   ├── library/           # Community library
│   └── mypage/            # User profile
├── components/            # React components
│   ├── layout/           # Header, Footer, Navigation
│   ├── book/             # Book-related components
│   ├── library/          # Library features
│   ├── mypage/           # Profile components
│   ├── ui/               # Reusable UI components
│   └── provider/         # Context providers
├── lib/                  # Utility functions
├── store/                # Zustand stores
├── types/                # TypeScript types
└── auth.ts               # NextAuth configuration
```

## 🎯 Key Features Implementation

### Session Management
- Server-side session handling with NextAuth
- Optimized session loading to prevent UI flickering
- Server/Client component separation for better performance

### Infinite Scroll
- Efficient pagination using TanStack Query infinite queries
- Intersection Observer for seamless loading

### Modal System
- Global modal with customizable sizes
- Confirmation modals for critical actions

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes

## 🌐 Deployment

This project is deployed on [Vercel](https://vercel.com/).

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/my-fairy-tale/frontend)

Don't forget to set up the required environment variables in your Vercel project settings.

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome! Feel free to open an issue if you find any bugs or have ideas for improvements.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Site**: [https://dreamteller-pi.vercel.app/](https://dreamteller-pi.vercel.app/)
- **Backend Repository**: [https://github.com/my-fairy-tale/backend](https://github.com/my-fairy-tale/backend)

## 👨‍💻 Author

**kjyook**

---

Made with ❤️ using Next.js, OpenAI, and lots of ☕
