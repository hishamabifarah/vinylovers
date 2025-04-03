import { ImageResponse } from "@vercel/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Get parameters from the request
    const artist = searchParams.get("artist") || "Unknown Artist"
    const album = searchParams.get("album") || "Unknown Album"
    const imageUrl = searchParams.get("image")
    const genre = searchParams.get("genre") || ""

    // Generate the image
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          background: "#f4f4f5",
          width: "100%",
          height: "100%",
          padding: "50px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {imageUrl && (
              <div
                style={{
                  width: "300px",
                  height: "300px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  backgroundColor: "#eee",
                }}
              >
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={album}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontSize: "48px", fontWeight: "bold" }}>{album}</div>
              <div style={{ fontSize: "36px", color: "#666" }}>{artist}</div>
              {genre && <div style={{ fontSize: "24px", color: "#888" }}>{genre}</div>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "24px", color: "#888" }}>Shared on Vinylovers</div>
            <div style={{ fontSize: "20px", color: "#888" }}>Discover vinyl records</div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error("Error generating OG image:", error)

    // Return a simple fallback image
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          fontSize: "48px",
          background: "#f4f4f5",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          padding: "50px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "40px",
          }}
        >
          <div style={{ fontSize: "64px", fontWeight: "bold", marginBottom: "20px" }}>Vinylovers</div>
          <div style={{ fontSize: "32px", color: "#666" }}>Discover and share vinyl records</div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  }
}

