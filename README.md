# 📝 Next.js Markdown Blog — High Performance & Aesthetic

A stunning, professional-grade personal blog starter built with **Next.js 16 (App Router)** and **Tailwind CSS v4**. It fetches content dynamically from a GitHub repository via the GitHub REST API, meaning your blog updates automatically whenever you push to your content repo.

![Blog Screenshot](https://raw.githubusercontent.com/yogiputrap/blog-markdown-github/main/public/screenshot.png) *(Note: Add your own screenshot here)*

## ✨ Key Features

- 🚀 **Next.js 16 App Router**: Leveraging the latest React Server Components for maximum speed.
- 🎨 **Tailwind CSS v4**: Ultra-fast, modern styling with zero-runtime CSS.
- 🐙 **GitHub API Integration**: Articles are sourced directly from your GitHub repo.
- 📄 **Markdown & MDX**: Full support for GFM, syntax highlighting (GitHub Light), and math.
- 📱 **Premium UI/UX**: 
  - Smooth sidebar drawer with profile info.
  - Interactive hero slideshow for highlights.
  - Reading progress bar & copy-to-clipboard code blocks.
  - Mobile-first, responsive, and whitespace-heavy aesthetic.
- 🏎️ **Optimized Performance**: 
  - Incremental Static Regeneration (ISR).
  - Exponential backoff retry logic for API resilience.
  - Built-in reading time estimator.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Content**: [GitHub REST API](https://docs.github.com/en/rest)
- **Parsing**: [Unified](https://unifiedjs.com/), [Remark](https://github.com/remarkjs/remark), [Rehype](https://github.com/rehypejs/rehype)
- **Icons**: Custom SVG icons (no heavy icon libraries)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone git@github.com:yogiputrap/blog-markdown-github.git
cd blog-markdown-github
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GITHUB_TOKEN=your_personal_access_token
```
*Tip: Using a `GITHUB_TOKEN` is highly recommended to avoid API rate limits.*

### 4. Configure Content Source
Edit `src/lib/github.ts` to point to your OWN repository:
```typescript
const OWNER = "your-username";
const REPO = "your-blog-repo";
const BRANCH = "main";
const CONTENT_DIR = "blog"; // The folder where your .md files live
```

### 5. Run locally
```bash
npm run dev
```

## 📂 Project Structure

```text
├── src/
│   ├── app/            # App Router (Pages, Layouts, Loading)
│   ├── components/     # UI Components (Header, Slider, PostCard, etc.)
│   └── lib/            # Logic (GitHub API, Post processing)
├── public/             # Static assets
└── tailwind.config.ts  # Tailwind configuration
```

## 📝 Writing Posts

The system expects files in `.md` or `.mdx` format with the following frontmatter:

```markdown
---
title: "Hello World"
date: "2025-02-23"
excerpt: "This is a short summary of the post."
cover: "https://example.com/image.jpg"
tags: ["Tech", "IoT"]
featured: true
---

# Your content starts here...
```

## 📄 License

This project is open-source and available under the MIT License.

---
Built with ❤️ by [yogiputrap](https://github.com/yogiputrap)
