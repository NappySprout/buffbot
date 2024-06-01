import { Context, Bot } from "grammy";

export function get(bot: Bot, db: D1Database) {
	bot.command("get", async (ctx: Context) => {
		let args = [];
		if (ctx.message && ctx.message.text) {
			args = ctx.message.text.split(" ");
		} else {
			await ctx.reply("Error: invalid command format. Use /get <lift> <week>");
			return;
		}
		if (args.length !== 3) {
			await ctx.reply("Error: invalid command format. Use /get <lift> <week>");
			return;
		}
		const lift = args[1].toLowerCase();
		const week = parseInt(args[2]);
		if (isNaN(week) || week < 1 || week > 4) {
			await ctx.reply("Error: invalid week. Use 1, 2, 3, or 4.");
			return;
		}
		let column: string;
		switch (lift) {
			case "dl":
				column = "deadlift_one_rep_max";
				break;
			case "bp":
				column = "bench_one_rep_max";
				break;
			case "sq":
				column = "squat_one_rep_max";
				break;
			case "sp":
				column = "shoulder_press_one_rep_max";
				break;
			default:
				await ctx.reply("Error: invalid lift. Use dl, bp, sq, or sp.");
				return;
		}
		const result: Record<string, unknown>[] =
			(await db.prepare(`SELECT ${column} FROM lift_data WHERE chat_id = ?`)
				.bind(ctx.chatId)
				.all()).results
		let RM: number
		if (result.length == 0) {
			await ctx.reply("No data found for this lift.");
			return
		}
		RM = Number(result[0][column]);
		const TM = RM * 90
		const plan = [
			[65, 75, 85],
			[70, 80, 90],
			[75, 85, 95],
			[40, 50, 60]
		]
		const reps = [
			[5, 5, 5],
			[3, 3, 3],
			[5, 3, 1],
			[5, 5, 5],
		]

		const c_plan = plan[week - 1];
		const c_reps = reps[week - 1];
		const weights = c_plan.map(perc => Math.round(TM * perc / 10000 / 2.5) * 2.5)
		const message =
			`Here is the plan for today!
		${c_reps[0]} reps ${weights[0]}kg (${(weights[0] - 20) / 2}kg)
		${c_reps[1]} reps ${weights[1]}kg (${(weights[1] - 20) / 2}kg)
		${c_reps[2]} reps ${weights[2]}kg (${(weights[2] - 20) / 2}kg)
		`
		await ctx.reply(message);
	});
}
