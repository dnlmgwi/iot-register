import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetTotalAttendanceCountUseCase } from '$lib/useCases/GetTotalAttendanceCount.js';
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

	//Get Stats
	const getTotalAttendanceCount = new GetTotalAttendanceCountUseCase(userProfileRepository);

	const result = await getTotalAttendanceCount.execute(student_id);

	if (result.kind === 'success') {
		return json(result.data);
	} else {
		error(500, result.error.message);
	}
}
