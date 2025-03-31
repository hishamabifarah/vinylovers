import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";

export async function GET() {
  try {
    const { user } = await validateRequest();

    console.log("Calling get-token for user: ", user?.id);

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // create special authentication token for Stream and return it to the frontend

    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60; // valid for 1 hour then refresh automatically which Stream handles automatically

    const issuedAt = Math.floor(Date.now() / 1000) - 60; // 1 minute in the past

    const token = streamServerClient.createToken(
      user.id,
      expirationTime,
      issuedAt,
    );

    return Response.json({ token });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}