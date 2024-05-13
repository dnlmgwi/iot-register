import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetUserProfileByIDUseCase } from '$lib/useCases/GetUserProfileByID.js';
import { rateLimiter } from '$lib/services/rateLimiter.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	if (rateLimiter(request)) {
		// If the rate limit is exceeded
		return error(429, 'Rate limit exceeded. Try again later.');
	}

	const userProfileRepository = new UserProfileRepository(locals.supabase);

	const { student_id } = await request.json();

	if (!student_id) {
		return error(500, 'Please read the docs');
	}

	const getUserProfile = new GetUserProfileByIDUseCase(userProfileRepository);
	const result = await getUserProfile.execute(student_id);

	if (result.kind === 'success') {
		return json(result.data);
	} else {
		return json(result.error.message, { status: 500 });
	}
}
