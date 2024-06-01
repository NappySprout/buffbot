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
    const result = await db.prepare(`SELECT ${column} FROM lift_data WHERE chat_id = ?`).bind(ctx.chatId).get();
    if (result) {
      await ctx.reply(`Your 1 rep max for ${lift} is ${result[column]}`);
    } else {
      await ctx.reply("No data found for this lift.");
    }
  });
}
