import { Context, Bot } from "grammy";
export function set(bot: Bot, db: D1Database) {
	bot.command("set", async (ctx: Context) => {
		const args = ctx.message.text.split(" ");
		if (args.length !== 3) {
			await ctx.reply("Error: invalid command format. Use /set <lift> <positive integer>");
			return;
		}
		const lift = args[1].toLowerCase();
		const value = parseInt(args[2]);
		if (isNaN(value) || value <= 0) {
			await ctx.reply("Error: invalid value. Use a positive integer.");
			return;
		}
		let column: string;
		switch (lift) {
			case "db":
				column = "deadlift_one_rep_max";
				break;
			case "sq":
				column = "squat_one_rep_max";
				break;
			case "bp":
				column = "bench_one_rep_max";
				break;
			case "sp":
				column = "shoulder_press_one_rep_max";
				break;
			default:
				await ctx.reply("Error: invalid lift. Use db, sq, bp, or sp.");
				return;
		}
		await db.prepare(`UPDATE lift_data SET ${column} = ? WHERE chat_id = ?`).bind(value, ctx.chatId).run();
		await ctx.reply("Success!");
	})
}
