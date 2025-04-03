import { ImageResponse } from "next/og"
import prisma from "@/lib/prisma"

export const runtime = "edge"
export const alt = "Vinyl Album Cover"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image({ params }: { params: { vinylId: string } }) {
  const { vinylId } = params

  // Get vinyl data
  const vinyl = await prisma.vinyl.findUnique({
    where: {
      id: vinylId,
    },
    include: {
      attachments: true,
      genre: true,
      user: true,
    },
  })

  if (!vinyl) {
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          fontSize: 48,
          background: "#f4f4f5",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Vinyl not found
      </div>,
    )
  }

  // Get the first attachment URL or use a default
  const imageUrl = vinyl.attachments[0]?.url || "/logo192.png"

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        background: "#f4f4f5",
        width: "100%",
        height: "100%",
        padding: 50,
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
          borderRadius: 20,
          padding: 40,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* @ts-ignore */}
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={vinyl.album}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 48, fontWeight: "bold" }}>{vinyl.album}</div>
            <div style={{ fontSize: 36, color: "#666" }}>{vinyl.artist}</div>
            {vinyl.genre && <div style={{ fontSize: 24, color: "#888" }}>{vinyl.genre.name}</div>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 24, color: "#888" }}>Shared on Vinylovers</div>
          <div style={{ fontSize: 20, color: "#888" }}>By {vinyl.user.displayName}</div>
        </div>
      </div>
    </div>,
    { ...size },
  )
}

