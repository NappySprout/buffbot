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
		if (args.length === 1) {
			await db.batch([
				db.prepare(`UPDATE lift_data SET deadlift_one_rep_max = deadlift_one_rep_max + 5 WHERE chat_id = ?`).bind(ctx.chatId),
				db.prepare(`UPDATE lift_data SET squat_one_rep_max = squat_one_rep_max + 5 WHERE chat_id = ?`).bind(ctx.chatId),
				db.prepare(`UPDATE lift_data SET bench_one_rep_max = bench_one_rep_max + 2.5 WHERE chat_id = ?`).bind(ctx.chatId),
				db.prepare(`UPDATE lift_data SET shoulder_press_one_rep_max = shoulder_press_one_rep_max + 2.5 WHERE chat_id = ?`).bind(ctx.chatId),
			]);
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
			return await ctx.reply(message);

		} else if (args.length < 2 || args.length > 3) {
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
			default:
				await ctx.reply("Error: invalid lift. Use dl, sq, bp, or sp.");
				return;
		}
		await db.prepare(
			`UPDATE lift_data SET ${column} = ${column} + ? WHERE chat_id = ?`).bind(increment, ctx.chatId).run();
		const newValue = (await db.prepare(`SELECT ${column} FROM lift_data WHERE chat_id = ?`).bind(ctx.chatId).first(column));
		await ctx.reply(`Success! Your new ${lift} one rep max is ${newValue}`);
	});
}
