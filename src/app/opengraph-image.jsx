import { ImageResponse } from "next/og";

export const alt = "Wear Zara — Modern Fashion Store";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0f0f0f",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 40 }}>
          <div style={{ width: 24, height: 56, borderRadius: 6, background: "#db4444" }} />
          <div style={{ fontSize: 32, color: "#db4444", fontWeight: 600 }}>New Season Collection</div>
        </div>
        <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -4 }}>Wear Zara</div>
        <div style={{ fontSize: 40, color: "#a3a3a3", marginTop: 24 }}>
          Modern fashion for men, women & kids — free delivery over $140.
        </div>
      </div>
    ),
    size,
  );
}
