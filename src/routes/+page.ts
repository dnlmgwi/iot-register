import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetUserProfileUseCase } from '$lib/useCases/GetUserProfile.js';
import { registerSchema } from '$lib/schemas/registerSchema';
import { superValidate } from 'sveltekit-superforms/client';

export const prerender = true;

export const load = async ({ parent }) => {
	const form = await superValidate(registerSchema);

	const { supabase, session } = await parent();

	if (!session) {
		return { form };
	}

	const userProfileRepository = new UserProfileRepository(supabase);
	const getUserProfile = new GetUserProfileUseCase(userProfileRepository);

	try {
		const profile = await getUserProfile.execute(session.user.id);
		return { form, profile };
	} catch {
		return { form };
	}
};
