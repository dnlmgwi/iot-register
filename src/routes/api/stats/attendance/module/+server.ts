import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetAttendanceCountByModuleUseCase } from '$lib/useCases/GetAttendanceCountByModule.js';
import { rateLimiter } from '$lib/services/rateLimiter.js';
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
	const getAttendanceCount = new GetAttendanceCountByModuleUseCase(userProfileRepository);

	const result = await getAttendanceCount.execute(module_id);

	if (result.kind === 'success') {
		return json(result.data);
	} else {
		return json(result.error.message, { status: 500 });
	}
}
