import { inspect } from 'node:util';
import {
	Command,
	type CommandContext,
	Declare,
	Middlewares,
	Options,
	createBooleanOption,
	createStringOption,
} from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types';

const DEV_GUILD_ID = '1243234751200890920';
const options = {
	code: createStringOption({
		required: true,
		description: 'Enter a code to execute',
	}),
	hide: createBooleanOption({
		description: 'Should Connections hide the result?',
	}),
};

@Declare({
	name: 'eval',
	guildId: [DEV_GUILD_ID],
	description: 'Evaluate a code with Connections',
})
@Options(options)
@Middlewares(['dev'])
export default class EvalCommand extends Command {
	async run(context: CommandContext<typeof options>) {
		const { code, hide } = context.options;
		const result = eval(code);

		if (result instanceof Promise) await result;

		await context.editOrReply({
			content: inspect(result),
			flags: hide ? MessageFlags.Ephemeral : void 0,
		});
	}

	onRunError(context: CommandContext, error: unknown) {
		return context.editOrReply({
			content: `Error: ${error}`,
			flags: MessageFlags.Ephemeral,
		});
	}
}
