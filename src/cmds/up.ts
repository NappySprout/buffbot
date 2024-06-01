import { Context, Bot } from "grammy";

export function up(bot: Bot, db: D1Database) {
	bot.command("up", async (ctx: Context) => {
		let args = [];
		if (ctx.message && ctx.message.text) {
			args = ctx.message.text.split(" ");
		} else {
			await ctx.reply("Error: invalid command format. Use /up <lift> [increment]");
			return;
		}
		if (args.length < 2 || args.length > 3) {
			await ctx.reply("Error: invalid command format. Use /up <lift> [increment]");
			return;
		}
		const lift = args[1].toLowerCase();
		let increment = 0;
		if (args.length === 3) {
			increment = parseInt(args[2]);
			if (isNaN(increment) || increment <= 0) {
				await ctx.reply("Error: invalid increment. Use a positive integer.");
				return;
			}
		} else {
			switch (lift) {
				case "dl":
				case "sq":
					increment = 5;
					break;
				case "bp":
				case "sp":
					increment = 2.5;
					break;
				default:
					await ctx.reply("Error: invalid lift. Use dl, sq, bp, or sp.");
					return;
			}
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
		}
		await db.prepare(
			`UPDATE lift_data SET ${column} = ${column} + ? WHERE chat_id = ?`).bind(increment, ctx.chatId).run();
		await ctx.reply("Success!");
	});
}
