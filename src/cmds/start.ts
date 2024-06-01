import { Context } from "grammy";
export async function start(ctx: Context) {
	await ctx.db.put("lift_data", { chat_id: ctx.chat.id, bench_one_rep_max: 0, deadlift_one_rep_max: 0, squat_one_rep_max: 0, shoulder_press_one_rep_max: 0 });
	await ctx.reply("Success!")
}
