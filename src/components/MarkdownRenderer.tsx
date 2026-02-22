import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import ArticleContent from "./ArticleContent";

async function processMarkdown(content: string): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeHighlight, { detect: true })
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(content);

    return result.toString();
}

export default async function MarkdownRenderer({
    content,
}: {
    content: string;
}) {
    const html = await processMarkdown(content);
    return <ArticleContent html={html} />;
}
