import { Context, Bot } from "grammy";
export function start(bot: Bot, db: D1Database) {
	bot.command("start", async (ctx: Context) => {
		const chat_id = ctx.chatId
		const { results } = await db.prepare(
			`INSERT INTO lift_data (chat_id, bench_one_rep_max, deadlift_one_rep_max, squat_one_rep_max, shoulder_press_one_rep_max) VALUES (?, 0, 0, 0, 0) ON CONFLICT (chat_id) DO NOTHING`
		)
			.bind(chat_id)
			.all();
		await ctx.reply("exist!")
	})
}
