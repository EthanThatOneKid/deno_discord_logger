import { discord_api_types } from "./deps.ts";

export interface ExecuteOptions {
  webhookURL: string;
  wait?: boolean;
  threadID?: string;
  onResponse?: (result: ExecuteResult) => void;
}

export type ExecuteResult =
  | discord_api_types.RESTPostAPIWebhookWithTokenResult
  | discord_api_types.RESTPostAPIWebhookWithTokenWaitResult;

export function execute(
  options: ExecuteOptions,
  jsonBody: discord_api_types.RESTPostAPIWebhookWithTokenJSONBody,
  f: typeof fetch = fetch,
): Promise<ExecuteResult | undefined> {
  const url = new URL(options.webhookURL);
  if (options.threadID) {
    url.searchParams.set("thread_id", options.threadID);
  }

  if (options.wait) {
    url.searchParams.set("wait", "true");
  }

  console.log({ jsonBody });

  return f(
    url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonBody),
    },
  )
    .then(async (response) => {
      if (!options.wait) {
        return;
      }

      const result = await response.json() as ExecuteResult;
      if (options.onResponse) {
        options.onResponse(result);
      }

      return result;
    });
}
