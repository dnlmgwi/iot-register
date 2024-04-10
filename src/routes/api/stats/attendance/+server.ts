import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetAttendanceCountUseCase } from '$lib/useCases/GetAttendanceCount.js';
import { rateLimiter } from '$lib/utils/rateLimiter.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ request, locals }) {
	if (rateLimiter(request)) {
		// If the rate limit is exceeded
		return error(429, 'Rate limit exceeded. Try again later.');
	}

	const userProfileRepository = new UserProfileRepository(locals.supabase);

	//Get Stats
	const getAttendanceCount = new GetAttendanceCountUseCase(userProfileRepository);

	const result = await getAttendanceCount.execute();

	if (result.kind === 'success') {
		return json(result.data);
	} else {
		error(500, result.error.message);
	}
}
