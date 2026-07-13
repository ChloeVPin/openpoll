import { ImageResponse } from "next/og";

export const alt = "Open Poll - Free, Real-Time Minimalist Polling";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#fcfeff",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "90px 100px",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Blurred decorative spot matching web app */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "400px",
          height: "400px",
          background: "rgba(26, 131, 219, 0.08)",
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />

      {/* Top Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "rgba(26, 131, 219, 0.06)",
            border: "1px solid rgba(26, 131, 219, 0.15)",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1a83db"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20v-6M6 20V10M18 20V4" />
          </svg>
        </div>
        <span
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#09090b",
            letterSpacing: "-0.5px",
            marginLeft: "8px",
          }}
        >
          Open Poll
        </span>
      </div>

      {/* Main Content Area (Left-aligned & Minimal) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "850px",
          marginTop: "40px",
          marginBottom: "auto",
        }}
      >
        <div
          style={{
            fontSize: "68px",
            fontWeight: "800",
            color: "#09090b",
            lineHeight: 1.15,
            letterSpacing: "-2px",
          }}
        >
          Free, Real-Time Minimalist Polling
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#71717a",
            lineHeight: 1.4,
            fontWeight: "400",
          }}
        >
          Create beautiful polls in seconds. No accounts, no ads, no tracking.
        </div>
      </div>

      {/* Bottom Row: Feature Badges */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            padding: "10px 20px",
            borderRadius: "9999px",
            background: "rgba(9, 9, 11, 0.05)",
            border: "1px solid rgba(9, 9, 11, 0.08)",
            fontSize: "18px",
            fontWeight: "600",
            color: "#27272a",
          }}
        >
          No Accounts
        </div>
        <div
          style={{
            padding: "10px 20px",
            borderRadius: "9999px",
            background: "rgba(9, 9, 11, 0.05)",
            border: "1px solid rgba(9, 9, 11, 0.08)",
            fontSize: "18px",
            fontWeight: "600",
            color: "#27272a",
          }}
        >
          Real-Time
        </div>
        <div
          style={{
            padding: "10px 20px",
            borderRadius: "9999px",
            background: "rgba(9, 9, 11, 0.05)",
            border: "1px solid rgba(9, 9, 11, 0.08)",
            fontSize: "18px",
            fontWeight: "600",
            color: "#27272a",
          }}
        >
          100% Free
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
