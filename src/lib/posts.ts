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
 * Generate a gradient placeholder for posts without covers
 */
function getPlaceholderGradient(slug: string): string {
    const gradients = [
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
        "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
        "linear-gradient(135deg, #f5576c 0%, #ff6a88 100%)",
        "linear-gradient(135deg, #667eea 0%, #48c6ef 100%)",
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

            const cover = frontmatter.cover || "";
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

            const cover = frontmatter.cover || "";
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
