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

	const result = await getUserProfile.execute(session.user.id);

	if (result.kind === 'success') {
		return { form, profile: result.data };
	} else {
		return { form, noProfile: true };
	}
};
