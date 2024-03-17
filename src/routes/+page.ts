export const prerender = true;

import { registerSchema } from '$lib/schemas/registerSchema';
import { superValidate } from 'sveltekit-superforms/client';

export const load = async () => {
	const form = await superValidate(registerSchema);

	return { form };
};
