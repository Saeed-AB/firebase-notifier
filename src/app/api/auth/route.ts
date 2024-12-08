import { GoogleAuth } from "google-auth-library";

const auth = new GoogleAuth({
  keyFile: "src/firebase-schema.json", // Path to your new service account file
  scopes: ["https://www.googleapis.com/auth/firebase.messaging"], // Correct scope
});

export async function GET() {
  try {
    const client = await auth.getClient();
    const token = await client.getAccessToken();

    return Response.json({
      authToken: token.token,
    });
  } catch (e) {
    let message = "Could not refresh access token.";

    if (e instanceof Error && e.message) {
      message = e.message;
    }
    return new Response(
      JSON.stringify({
        error: message,
      }),
      {
        status: 400,
      }
    );
  }
}
