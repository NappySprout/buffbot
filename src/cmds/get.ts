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
		const result = (await db.prepare(`SELECT ${column} FROM lift_data WHERE chat_id = ?`)
			.bind(ctx.chatId)
			.all()).results
		/*I would like the program to return wendler 5 3 1 instead of the 1 rep max
firstly define the training max as 90% of 1 rep max, let it be TM
here is the plan of wendler 531 as seen by the weeks and what reps and sets they contain
week 1:  (Wendler 5’s) – start with a warm-up for 3 sets (40% x5, 50% x5 and 60% x3)

65% of TM x 5 reps

75% of TM x 5 reps

85% of TM x 5+ reps (As many reps as possible, MUST be more than 5)

Week 2: (Wendler 3’s) – start with a warm-up for 3 sets (40% x5, 50% x5 and 60% x3)

70% of TM x 3 reps

80% of TM x 3 reps

90% of TM x 3+ reps (As many reps as possible, MUST be more than 3)

Week 3: (Wendler 5/3/1) – start with a warm-up for 3 sets (40% x5, 50% x5 and 60% x3)

75% of TM x 5 reps

85% of TM x 3 reps

95% of TM x 1+ reps (As many reps as possible, MUST be more than 1)

Week 4: (De-Load)

All Strength for this week will ONLY be in the 40%-60% of TM .

this is the gist of wendler 5 3 1.
for the final weight that is used in the program, please round it to the nearest 2.5 as that is the
smallest weight increment that can be added to a barbell
		 */
		if (result.length > 0) {
			await ctx.reply(
				`Your 1 rep max for ${lift} is ${result[0][column]}`
			);
		} else {
			await ctx.reply("No data found for this lift.");
		}
	});
}
