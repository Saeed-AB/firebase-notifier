import axios, { AxiosError } from "axios";

type PostBodyT = {
  token: string;
  method: string;
  topic: string;
  authToken: string;
};

const handleApiError = (error: unknown) => {
  let errorMessage = "Something went wrong!";
  let status = 400;
  if (error instanceof AxiosError) {
    status = error.response?.status ?? 400;
    errorMessage = error?.response?.statusText || error?.message;
  }

  return new Response(
    JSON.stringify({
      error: errorMessage,
    }),
    {
      status,
    }
  );
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const authToken = searchParams.get("authToken");
  const firebaseToken = searchParams.get("firebaseToken");

  try {
    const res = await axios.get(
      `https://iid.googleapis.com/iid/info/${firebaseToken}?details=true`,
      {
        headers: {
          // access_token_auth: true,
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const topics = res.data?.rel?.topics ?? {};

    return Response.json({
      status: 200,
      topics,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const body: PostBodyT = await request.json();

  const reqUrl = `https://iid.googleapis.com/iid/v1/${body.token}/rel/topics/${body.topic}`;

  try {
    const res = await fetch(reqUrl, {
      method: body.method,
      headers: {
        access_token_auth: "true",
        Authorization: `Bearer ${body.authToken}`,
      },
    });

    if (!res.ok) {
      return handleApiError(res);
    }
    return Response.json({ status: 201, data: "Topic Created" });
  } catch (error) {
    return handleApiError(error);
  }
}
