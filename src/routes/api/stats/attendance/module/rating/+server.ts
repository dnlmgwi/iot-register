import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetAttendanceCountByModuleWithRatingUseCase } from '$lib/useCases/GetAttendanceCountByModuleWithRatings.js';
import { rateLimiter } from '$lib/utils/rateLimiter.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	if (rateLimiter(request)) {
		// If the rate limit is exceeded
		return error(429, 'Rate limit exceeded. Try again later.');
	}

	const userProfileRepository = new UserProfileRepository(locals.supabase);

	const { module_id } = await request.json();

	if (!module_id) {
		return error(500, 'Please read the docs');
	}

	//Get Stats
	const getAttendanceCountWithRating = new GetAttendanceCountByModuleWithRatingUseCase(
		userProfileRepository
	);

	const result = await getAttendanceCountWithRating.execute(module_id);

	if (result.kind === 'success') {
		return json(result.data);
	} else {
		error(500, result.error.message);
	}
}
