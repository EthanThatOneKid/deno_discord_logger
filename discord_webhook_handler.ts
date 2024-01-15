import { discord_api_types, log } from "./deps.ts";
import * as discord_execute_webhook from "./discord_execute_webhook.ts";

export type FormatDiscordWebhook = (
  payload: string,
) => discord_api_types.RESTPostAPIWebhookWithTokenJSONBody;

/**
 * DiscordWebhookHandlerOptions is a set of options for initializing a
 * DiscordWebhookHandler.
 *
 * @see
 * https://discord.com/developers/docs/resources/webhook#execute-webhook
 */
export interface DiscordWebhookHandlerOptions
  extends log.BaseHandlerOptions, discord_execute_webhook.ExecuteOptions {
  formatDiscordWebhook?: FormatDiscordWebhook;
}

export class DiscordWebhookHandler extends log.BaseHandler {
  protected _options: DiscordWebhookHandlerOptions;

  constructor(levelName: log.LevelName, options: DiscordWebhookHandlerOptions) {
    super(levelName, options);
    this._options = options;
  }

  override log(payload: string): void {
    // TODO: Guarantee that the messages are sent in
    // the order they were logged.
    const jsonBody = this._options.formatDiscordWebhook
      ? this._options.formatDiscordWebhook(payload)
      : { content: payload };
    discord_execute_webhook.execute(
      this._options,
      jsonBody,
    );
  }
}
