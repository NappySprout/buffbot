import { Context, Bot } from "grammy";

export function see(bot: Bot, db: D1Database) {
	bot.command("see", async (ctx: Context) => {
		const results: Record<string, unknown>[] = (await db.prepare(`SELECT deadlift_one_rep_max, bench_one_rep_max, squat_one_rep_max, shoulder_press_one_rep_max FROM lift_data WHERE chat_id = ?`)
			.bind(ctx.chatId)
			.all()).results;
		if (results.length === 0) {
			await ctx.reply("No data found.");
			return;
		}
		const message = `Here are your current lifts:
Deadlift: ${results[0].deadlift_one_rep_max}
Bench Press: ${results[0].bench_one_rep_max}
Squat: ${results[0].squat_one_rep_max}
Shoulder Press: ${results[0].shoulder_press_one_rep_max}`;
		await ctx.reply(message);
	});
}
