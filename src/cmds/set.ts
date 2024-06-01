import { Context, Bot } from "grammy";
export function set(bot: Bot, db: D1Database) {
	bot.command("set", async (ctx: Context) => {
		let args = []
		if (ctx.message && ctx.message.text) {
			args = ctx.message.text.split(" ");
			// rest of the code
		} else {
			await ctx.reply("Error: invalid command format. Use /set <lift> <positive integer>");
			return;
		}
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
			case "dl":
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
				await ctx.reply("Error: invalid lift. Use dl, sq, bp, or sp.");
				return;
			default:
				await ctx.reply("Error: invalid lift. Use dl, sq, bp, or sp.");
				return;
		}
		await db.prepare(`UPDATE lift_data SET ${column} = ? WHERE chat_id = ?`).bind(value, ctx.chatId).run();
		await ctx.reply("Success!");
	})
}
