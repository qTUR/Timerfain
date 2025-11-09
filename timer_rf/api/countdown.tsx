/*
  Vercel Edge Function that renders a PNG countdown image in Arabic.
  Works in Outlook because it's a simple <img> request.
*/

import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge"
};

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 500;

// Fetch an Arabic font (Noto Kufi Arabic) once per runtime
let fontDataPromise: Promise<ArrayBuffer> | null = null;
function loadFont(): Promise<ArrayBuffer> {
  if (!fontDataPromise) {
    fontDataPromise = fetch(
      "https://fonts.gstatic.com/s/notokufiarabic/v26/q5uFoaZJ5TiC6G6-nq7Qpg73xZ7fQYP9x0lP.woff2"
    ).then((res) => res.arrayBuffer());
  }
  return fontDataPromise;
}

function clampNonNegative(n: number): number {
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

function diffParts(ms: number) {
  const totalSeconds = clampNonNegative(Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return { days, hours, minutes, seconds };
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);

  const deadlineIso = searchParams.get("deadline");
  const title = searchParams.get("title") || "الاطلاق التجريبي";
  const bg = searchParams.get("bg") || "#2a0170"; // deep purple
  const grad = searchParams.get("grad") || "#7c2df5"; // lighter purple

  const width = Number(searchParams.get("w") || DEFAULT_WIDTH);
  const height = Number(searchParams.get("h") || DEFAULT_HEIGHT);

  const deadline = deadlineIso ? Date.parse(deadlineIso) : Date.now();
  const now = Date.now();
  const remaining = Math.max(0, deadline - now);
  const { days, hours, minutes, seconds } = diffParts(remaining);
  const finished = remaining <= 0;

  const fontData = await loadFont();

  // Reusable block style
  const blockStyle: any = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    width: 220,
    height: 140
  };

  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          flexDirection: "column",
          fontFamily: "NotoKufiArabic",
          background: `linear-gradient(135deg, ${bg}, ${grad})`,
          color: "#fff"
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 700 }}>{title}</div>
          <div style={{ opacity: 0.9, fontSize: 28 }}>الأيام المتبقية على الإطلاق التجريبي</div>

          <div style={{ marginTop: 20, display: "flex", gap: 24 }}>
            {/* Days */}
            <div style={blockStyle}>
              <div style={{ fontSize: 56, fontWeight: 800 }}>{days}</div>
              <div style={{ fontSize: 26, opacity: 0.95 }}>اليوم</div>
            </div>
            {/* Hours */}
            <div style={blockStyle}>
              <div style={{ fontSize: 56, fontWeight: 800 }}>{hours}</div>
              <div style={{ fontSize: 26, opacity: 0.95 }}>الساعة</div>
            </div>
            {/* Minutes */}
            <div style={blockStyle}>
              <div style={{ fontSize: 56, fontWeight: 800 }}>{minutes}</div>
              <div style={{ fontSize: 26, opacity: 0.95 }}>الدقيقة</div>
            </div>
            {/* Seconds */}
            <div style={blockStyle}>
              <div style={{ fontSize: 56, fontWeight: 800 }}>{seconds}</div>
              <div style={{ fontSize: 26, opacity: 0.95 }}>الثانية</div>
            </div>
          </div>

          {finished && (
            <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>تم الإطلاق</div>
          )}
        </div>

        <div style={{ textAlign: "center", fontSize: 18, opacity: 0.8, marginBottom: 20 }}>RFQH TEAM.</div>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        {
          name: "NotoKufiArabic",
          data: fontData,
          style: "normal",
          weight: 700
        }
      ],
      headers: {
        // A short cache so the timer ticks when the email is reopened
        "Cache-Control": "s-maxage=1, stale-while-revalidate=59"
      }
    }
  );
}

