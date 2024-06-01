import { Bot, Context, webhookCallback } from "grammy";

export interface Env {
	BOT_INFO: string;
	BOT_TOKEN: string;
	DB: D1Database;
}

import { start } from "./cmds/start"
import { set } from "./cmds/set"
import { get } from "./cmds/get"

const cmds = [
	start,
	set,
	get

]

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const bot = new Bot(env.BOT_TOKEN, { botInfo: JSON.parse(env.BOT_INFO) });

		cmds.forEach(cmd => {
			cmd(bot, env.DB)
		})

		return webhookCallback(bot, "cloudflare-mod")(request);
	},
};
