import matter from "gray-matter";
import readingTime from "reading-time";
import { getAllMarkdownFiles, getFileContent, CONTENT_DIR } from "./github";

export interface Post {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    cover: string;
    tags: string[];
    featured: boolean;
    readingTime: string;
    filePath: string;
}

export interface PostDetail extends Post {
    content: string;
    rawMarkdown: string;
}

/**
 * Generate a slug from the file path.
 * Example: blog/iot/Hari Pertama.md → iot-hari-pertama
 */
function generateSlug(filePath: string): string {
    // Remove CONTENT_DIR prefix
    let slug = filePath;
    if (slug.startsWith(CONTENT_DIR + "/")) {
        slug = slug.slice(CONTENT_DIR.length + 1);
    }

    // Remove file extension
    slug = slug.replace(/\.(md|mdx)$/, "");

    // Replace path separators and spaces with hyphens
    slug = slug
        .replace(/\//g, "-")
        .replace(/\s+/g, "-")
        .toLowerCase();

    // Clean up multiple hyphens
    slug = slug.replace(/-+/g, "-").replace(/^-|-$/g, "");

    return slug;
}

/**
 * Extract title from first heading in markdown content
 */
function extractTitleFromContent(content: string): string {
    const match = content.match(/^#\s+(.+)$/m);
    if (match) return match[1].trim();

    // Fallback to filename-like title
    return "Untitled";
}

/**
 * Extract the first image URL from markdown content to use as cover
 */
function extractFirstImage(content: string): string {
    // Matches ![alt text](url)
    const match = content.match(/!\[.*?\]\((.+?)\)/);
    if (match) return match[1];

    // Matches <img src="url" ... />
    const htmlMatch = content.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
    if (htmlMatch) return htmlMatch[1];

    return "";
}

function getPlaceholderGradient(slug: string): string {
    // Array of subtle, muted pastel gradients (Tailwind 100->200 shades)
    const gradients = [
        "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", // Soft Blue
        "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)", // Soft Indigo
        "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", // Soft Emerald
        "linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)", // Soft Orange
        "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)", // Soft Pink
        "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)", // Soft Purple
        "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)", // Soft Teal
        "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", // Soft Amber
        "linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)", // Soft Rose
        "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)", // Soft Slate
    ];

    // Use slug hash to pick a consistent gradient
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
        hash = slug.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
}

export async function getAllPosts(): Promise<Post[]> {
    const files = await getAllMarkdownFiles();

    const posts: Post[] = await Promise.all(
        files.map(async (file) => {
            const rawContent = await getFileContent(file.path);
            const { data: frontmatter, content } = matter(rawContent);
            const slug = generateSlug(file.path);
            const stats = readingTime(content);

            const title =
                frontmatter.title || extractTitleFromContent(content) || "Untitled";

            const excerpt =
                frontmatter.excerpt ||
                content
                    .replace(/^#.*$/gm, "")
                    .replace(/!\[.*?\]\(.*?\)/g, "")
                    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
                    .replace(/[*_~`>]/g, "")
                    .replace(/\n+/g, " ")
                    .trim()
                    .slice(0, 160) + "...";

            const cover = frontmatter.cover || extractFirstImage(content) || "";
            const tags: string[] = frontmatter.tags
                ? Array.isArray(frontmatter.tags)
                    ? frontmatter.tags
                    : [frontmatter.tags]
                : [];

            const date = frontmatter.date
                ? new Date(frontmatter.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })
                : "No date";

            return {
                slug,
                title,
                date,
                excerpt,
                cover,
                tags,
                featured: !!frontmatter.featured,
                readingTime: stats.text,
                filePath: file.path,
            };
        })
    );

    // Filter out empty/untitled stub files
    const validPosts = posts.filter(
        (p) => !(p.title === "Untitled" && p.readingTime === "0 min read")
    );

    // Sort by date descending (newest first), "No date" at the end
    return validPosts.sort((a, b) => {
        if (a.date === "No date" && b.date === "No date") return 0;
        if (a.date === "No date") return 1;
        if (b.date === "No date") return -1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export async function getPostBySlug(
    slug: string
): Promise<PostDetail | null> {
    const files = await getAllMarkdownFiles();

    for (const file of files) {
        const fileSlug = generateSlug(file.path);
        if (fileSlug === slug) {
            const rawContent = await getFileContent(file.path);
            const { data: frontmatter, content } = matter(rawContent);
            const stats = readingTime(content);

            const title =
                frontmatter.title || extractTitleFromContent(content) || "Untitled";

            const excerpt =
                frontmatter.excerpt ||
                content
                    .replace(/^#.*$/gm, "")
                    .replace(/!\[.*?\]\(.*?\)/g, "")
                    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
                    .replace(/[*_~`>]/g, "")
                    .replace(/\n+/g, " ")
                    .trim()
                    .slice(0, 160) + "...";

            const cover = frontmatter.cover || extractFirstImage(content) || "";
            const tags: string[] = frontmatter.tags
                ? Array.isArray(frontmatter.tags)
                    ? frontmatter.tags
                    : [frontmatter.tags]
                : [];

            const date = frontmatter.date
                ? new Date(frontmatter.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })
                : "No date";

            // Strip the leading H1 — line-based so blank lines before it don't matter
            // Already displayed as the page title above the content
            const lines = content.split("\n");
            const h1Idx = lines.findIndex((l) => /^#\s+\S/.test(l));
            if (h1Idx !== -1) lines.splice(h1Idx, 1);
            const contentWithoutTitle = lines.join("\n").trimStart();

            return {
                slug,
                title,
                date,
                excerpt,
                cover,
                tags,
                featured: !!frontmatter.featured,
                readingTime: stats.text,
                filePath: file.path,
                content: contentWithoutTitle,
                rawMarkdown: rawContent,
            };
        }
    }

    return null;
}

export { getPlaceholderGradient };
