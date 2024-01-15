import { discord_api_types, log } from "../deps.ts";
import { DiscordWebhookHandler } from "../mod.ts";

function formatDiscordWebhook(payload: string) {
  const { level, datetime, message } = JSON.parse(payload) as {
    level: string;
    datetime: number;
    message: string;
  };
  return {
    embeds: [{
      title: level,
      description: message,
      footer: {
        text: new Date(datetime).toISOString(),
      },
      color: {
        DEBUG: 0x00ff00,
        INFO: 0x0000ff,
        WARNING: 0xffff00,
        ERROR: 0xff0000,
        CRITICAL: 0xff0000,
      }[level],
    }],
  } satisfies discord_api_types.RESTPostAPIWebhookWithTokenJSONBody;
}

log.setup({
  handlers: {
    console: new log.ConsoleHandler("DEBUG", {
      formatter: log.formatters.jsonFormatter,
      useColors: true,
    }),
    discord: new DiscordWebhookHandler("DEBUG", {
      webhookURL: Deno.env.get("DISCORD_WEBHOOK_URL")!,
      formatter: log.formatters.jsonFormatter,
      formatDiscordWebhook,
    }),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console", "discord"],
    },
  },
});

log.debug("Hello debug");
log.info("Hello info");
log.warn("Hello warn");
log.error("Hello error");
log.critical("Hello critical");
