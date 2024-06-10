import { Bot, Context, webhookCallback } from "grammy";

export interface Env {
	BOT_INFO: string;
	BOT_TOKEN: string;
	DB: D1Database;
}

import { start } from "./cmds/start"
import { set } from "./cmds/set"
import { get } from "./cmds/get"
import { up } from "./cmds/up"
import { see } from "./cmds/see"

const cmds = [
	start,
	set,
	get,
	up,
	see,
]

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const bot = new Bot(env.BOT_TOKEN, { botInfo: JSON.parse(env.BOT_INFO) });
		await bot.api.setMyCommands([
			{ command: "set", description: "set <dl|sq|bp|sp> <number> (set main lifts 1RM amount)" },
			{ command: "get", description: "get <dl|sq|bp|sp> <1|2|3|4> (get main lifts program on week 1, 2 , 3 or 4)" },
			{ command: "up", description: "up <dl|sq|bp|sp> <number> (increment main lifts 1RM, if no args, increment all by default value)" },
			{ command: "see", description: "see (see all 1RM)" },
		]);

		cmds.forEach(cmd => {
			cmd(bot, env.DB)
		})

		return webhookCallback(bot, "cloudflare-mod")(request);
	},
};
