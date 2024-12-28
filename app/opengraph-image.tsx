import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image size
export const size = { width: 1200, height: 630 };

// Image content type
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "black",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: "50px",
          paddingLeft: "50px",
        }}
      >
        <img src="/logo.svg" alt="Logo" style={{ height: "300px", width: "auto" }} />
      </div>
    ),
    { ...size },
  );
}
