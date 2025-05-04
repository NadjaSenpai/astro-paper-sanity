import { format } from "date-fns";
import { ja } from "date-fns/locale/ja";

interface Props {
  title: string;
  description?: string;
  author?: string;
  pubDate?: string | Date;
  modDate?: string | Date;
  siteTitle: string;
  siteAuthor: string;
}

const parseDate = (value: string | Date | undefined): Date | undefined => {
  if (!value) return undefined;
  const date = typeof value === "string" ? new Date(value) : value;
  return isNaN(date.getTime()) ? undefined : date;
};

export default function PostOgTemplate(props: Props) {
  const {
    title,
    description,
    author,
    pubDate,
    modDate,
    siteTitle,
    siteAuthor,
  } = props;

  const pub = parseDate(pubDate)
    ? format(parseDate(pubDate)!, "yyyy.MM.dd", { locale: ja })
    : "—";
  const mod = parseDate(modDate)
    ? format(parseDate(modDate)!, "yyyy.MM.dd", { locale: ja })
    : undefined;

  return (
    <div
      style={{
        background: "#212737",
        color: "#fff",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px",
        boxSizing: "border-box",
        fontFamily: "Inter 24pt, Noto Sans JP",
      }}
    >
      <div
        style={{
          fontSize: "64px",
          fontWeight: 700,
          textAlign: "left",
          wordBreak: "normal",
          overflowWrap: "break-word",
          overflow: "hidden",
          maxHeight: "480px",
          padding: "0 30px 10px 30px",
          lineHeight: 1.3,
          maxWidth: "1100px",
        }}
      >
        {title}
      </div>
        {description && (
          <div
            style={{
              fontSize: "32px",
              fontWeight: 400,
              opacity: 0.9,
              textAlign: "left",
              wordBreak: "normal",
              overflowWrap: "break-word",
              overflow: "hidden",
              padding: "0px 50px 30px 50px",
              maxHeight: "400px",
              maxWidth: "1100px",
              marginTop: "10px",
              marginBottom: "15px",
              lineHeight: 1.6,
            }}
          >
            {description}
          </div>
        )}
      <div
        style={{
          fontSize: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginLeft: "30px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                width: "110px",
                textAlign: "right",
                opacity: 0.7,
                fontFamily: "Recursive Monospace, monospace",
              }}
            >
              Published:
            </span>
            <span
              style={{
                fontFamily: "Recursive Monospace, monospace",
                marginLeft: "48px",
              }}
            >
              {pub ?? "—"}
            </span>
          </div>

          {mod && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  width: "110px",
                  textAlign: "right",
                  opacity: 0.7,
                  fontFamily: "Recursive Monospace, monospace",
                }}
              >
                Modified:
              </span>
              <span
                style={{
                  fontFamily: "Recursive Monospace, monospace",
                  marginLeft: "48px",
                }}
              >
                {mod}
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "4px",
            fontWeight: "700",
            fontFamily: "Satoshi, Noto Sans JP, sans-serif",
            marginRight: "30px",
          }}
        >
          <span style={{ fontSize: "48px", color: "#ff6b01" }}>
            {siteTitle}
          </span>
          <span style={{ opacity: 0.8, fontWeight: "400", paddingRight: "8px" }}>
            by {author ?? siteAuthor}
          </span>
        </div>
      </div>
    </div>
  );
}