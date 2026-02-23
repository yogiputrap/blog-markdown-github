"use client";

import { useEffect, useRef } from "react";

const CHECK_SVG = `<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`;
const COPY_SVG = `<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;

import { ReactNode } from "react";

export default function ArticleContent({ contentNode }: { contentNode: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = ref.current;
        if (!container) return;

        const preElements = container.querySelectorAll<HTMLPreElement>("pre");

        preElements.forEach((pre) => {
            // Avoid double-wrapping
            if (pre.parentElement?.dataset.codeWrapper) return;

            const code = pre.querySelector("code");
            if (!code) return;

            // Detect language from class e.g. "language-javascript"
            const langClass = Array.from(code.classList).find((c) =>
                c.startsWith("language-")
            );
            const lang = langClass ? langClass.replace("language-", "") : "";

            // Wrapper div
            const wrapper = document.createElement("div");
            wrapper.dataset.codeWrapper = "1";
            wrapper.style.cssText = "position:relative;margin:1.5em 0;";
            pre.parentNode!.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            // Top bar (lang badge + copy button)
            const topBar = document.createElement("div");
            topBar.style.cssText =
                "display:flex;align-items:center;justify-content:space-between;" +
                "padding:8px 12px 7px 14px;border-bottom:1px solid #e5e7eb;background:#f3f4f6;";

            // Language badge
            const badge = document.createElement("span");
            badge.textContent = lang || "code";
            badge.style.cssText =
                "font-size:11px;font-weight:600;letter-spacing:0.06em;" +
                "text-transform:uppercase;color:#6b7280;font-family:ui-monospace,monospace;";
            topBar.appendChild(badge);

            // Copy button
            const btn = document.createElement("button");
            btn.innerHTML = COPY_SVG;
            btn.title = "Copy code";
            btn.style.cssText =
                "display:flex;align-items:center;gap:5px;padding:3px 9px;" +
                "background:white;border:1px solid #e5e7eb;" +
                "border-radius:6px;color:#6b7280;font-size:11px;font-weight:500;" +
                "font-family:ui-monospace,monospace;cursor:pointer;transition:all 0.15s;" +
                "white-space:nowrap;";
            btn.onmouseenter = () => {
                btn.style.background = "#f9fafb";
                btn.style.color = "#374151";
                btn.style.borderColor = "#d1d5db";
            };
            btn.onmouseleave = () => {
                if (!btn.dataset.copied) {
                    btn.style.background = "white";
                    btn.style.color = "#6b7280";
                    btn.style.borderColor = "#e5e7eb";
                }
            };
            btn.onclick = () => {
                const text = code.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    btn.innerHTML = CHECK_SVG + `<span>Copied!</span>`;
                    btn.style.color = "#059669";
                    btn.style.borderColor = "#a7f3d0";
                    btn.style.background = "#ecfdf5";
                    btn.dataset.copied = "1";
                    setTimeout(() => {
                        btn.innerHTML = COPY_SVG;
                        btn.style.color = "#6b7280";
                        btn.style.borderColor = "#e5e7eb";
                        btn.style.background = "white";
                        delete btn.dataset.copied;
                    }, 2000);
                });
            };
            topBar.appendChild(btn);
            wrapper.insertBefore(topBar, pre);
        });
    }, [contentNode]);

    return (
        <div ref={ref} className="prose">
            {contentNode}
        </div>
    );
}
