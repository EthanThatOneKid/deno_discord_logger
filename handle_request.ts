import { execute } from "./discord_execute_webhook.ts";

export async function handleRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Only POST requests are allowed", { status: 405 });
  }

  const url = new URL(request.url);
  const webhookURL = url.searchParams.get("webhook_url");
  if (!webhookURL) {
    return new Response("No webhook URL provided", { status: 400 });
  }
  const threadID = url.searchParams.get("thread_id");
  const wait = url.searchParams.get("wait");
  const result = await execute(
    {
      webhookURL,
      wait: wait === "true",
      threadID: threadID || undefined,
    },
    await request.json(),
  );

  return Response.json(result);
}
