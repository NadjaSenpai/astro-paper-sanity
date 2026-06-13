// Shiki 出力の各 pre にコピーボタンを付与（ビュー遷移にも対応）
function attachCopyButtons() {
  document.querySelectorAll(".shiki pre, pre.shiki").forEach((pre) => {
    const host = pre.closest(".shiki") || pre;
    if (host.querySelector(".copy-code")) return;
    host.style.position = "relative";
    const btn = document.createElement("button");
    btn.className =
      "copy-code absolute right-3 top-2 rounded bg-muted px-2 py-1 text-xs font-medium text-foreground";
    btn.type = "button";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code");
    btn.addEventListener("click", async () => {
      const codeEl = pre.querySelector("code") || pre;
      const text = (codeEl.textContent || "").trim();
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 1500);
      } catch (e) {
        console.warn("[copy-code] clipboard write failed:", e);
        btn.textContent = "Failed";
        setTimeout(() => (btn.textContent = "Copy"), 1500);
      }
    });
    host.appendChild(btn);
  });
}
document.addEventListener("DOMContentLoaded", attachCopyButtons);
document.addEventListener("astro:page-load", attachCopyButtons);
