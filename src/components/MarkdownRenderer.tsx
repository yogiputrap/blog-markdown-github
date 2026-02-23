import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeReact from "rehype-react";
import * as prod from "react/jsx-runtime";
import ArticleContent from "./ArticleContent";
import Image from "next/image";
import { ReactNode } from "react";

const production = {
    Fragment: prod.Fragment,
    jsx: prod.jsx,
    jsxs: prod.jsxs,
    components: {
        img: (props: any) => {
            return (
                <span className="block relative w-full mt-8 mb-8 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                    <img
                        {...props}
                        src={props.src}
                        alt={props.alt || "Article image"}
                        loading="lazy"
                        className="w-full h-auto object-contain max-h-[70vh] m-0"
                    />
                </span>
            );
        },
    },
};

async function processMarkdown(content: string): Promise<ReactNode> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeHighlight, { detect: true })
        .use(rehypeReact, production as any)
        .process(content);

    return result.result;
}

export default async function MarkdownRenderer({
    content,
}: {
    content: string;
}) {
    const reactContent = await processMarkdown(content);
    return <ArticleContent contentNode={reactContent} />;
}
