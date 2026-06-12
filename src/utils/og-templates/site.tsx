type Props = {
  title: string;
  siteTitle: string;
  description?: string;
  siteDescription: string;
  siteAuthor: string;
};

export default function SiteOgTemplate({
  title,
  siteTitle,
  description,
  siteDescription,
}: Props) {
  return (
    <div
      style={{
        background: "#212737",
        color: "#fff",
        width: "100%",
        height: "100%",
        display: "flex", // ✅ 最上位もOK
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "120px",
        boxSizing: "border-box",
        fontFamily: "Inter 24pt, Noto Sans JP, Recursive Monospace",
      }}
    >
      <div
        style={{
          display: "flex", // ✅ ← 明示追加
          flexDirection: "column",
          alignItems: "flex-start",
          textAlign: "left",
          gap: "18px",
        }}
      >
        <div
          style={{
            fontFamily: "Satoshi",
            fontSize: "96px",
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#ff6b01",
          }}
        >
          {title ?? siteTitle}
        </div>
        <div
          style={{
            fontFamily: "Manrope, Noto Sans JP, sans-serif",
            fontSize: "24px",
            fontWeight: 300,
            opacity: 0.8,
          }}
        >
          {(description ?? siteDescription) ||
            "A modern blog powered by Astro + Sanity"}
        </div>
      </div>
    </div>
  );
}
