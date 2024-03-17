import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetUserProfileUseCase } from '$lib/useCases/GetUserProfile.js';

import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { registerSchema } from '$lib/schemas/registerSchema.js';

export const load = async ({ locals: { supabase, getSession }, request }) => {
	const form = await superValidate(request, registerSchema);

	const session = await getSession();

	if (!session) {
		throw redirect(303, '/');
	}

	const userProfileRepository = new UserProfileRepository(supabase);
	const getUserProfile = new GetUserProfileUseCase(userProfileRepository);
	const profile = await getUserProfile.execute(session.user.id);

	return { session, profile, form };
};
