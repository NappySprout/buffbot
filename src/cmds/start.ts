import { Context, Bot } from "grammy";
export function start(bot: Bot, db: D1Database) {
	bot.command("start", async (ctx: Context) => {
		const chat_id = ctx.chatId
		const { results } = await db.prepare(
			//sql query to insert chat_id and set all main lift int to 0 if chat_id already exist in db do nothing
		)
			.bind(chat_id)
			.all();
		await ctx.reply(results.toString())
	})
}
