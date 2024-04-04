import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetAttendanceCountByModuleUseCase } from '$lib/useCases/GetAttendanceCountByModule.js';
import { GetAttendanceCountByModuleWithRatingUseCase } from '$lib/useCases/GetAttendanceCountByModuleWithRatings.js';
import { rateLimiter } from '$lib/utils/rateLimiter.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	if (rateLimiter(request)) {
		// If the rate limit is exceeded
		return new Response('Rate limit exceeded. Try again later.', { status: 429 });
	}

	const userProfileRepository = new UserProfileRepository(locals.supabase);

	const { module_id } = await request.json();

	if (!module_id) {
		return json({ message: 'Please read the docs' }, { status: 400 });
	}

	try {
		//Get Stats
		const getAttendanceCountWithRating = new GetAttendanceCountByModuleWithRatingUseCase(
			userProfileRepository
		);

		const data = await getAttendanceCountWithRating.execute(module_id);

		return json({ data });
	} catch (error) {
		return json({ message: 'Data Not Found' }, { status: 404 });
	}
}
