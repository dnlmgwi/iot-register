import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetAttendanceCountUseCase } from '$lib/useCases/GetAttendanceCount.js';
import { rateLimiter } from '$lib/utils/rateLimiter.js';
import { json } from '@sveltejs/kit';

export async function GET({ request, locals }) {
	if (rateLimiter(request)) {
		// If the rate limit is exceeded
		return new Response('Rate limit exceeded. Try again later.', { status: 429 });
	}

	const userProfileRepository = new UserProfileRepository(locals.supabase);

	try {
		//Get Stats
		const getAttendanceCount = new GetAttendanceCountUseCase(userProfileRepository);

		const data = await getAttendanceCount.execute();

		return json({ data });
	} catch (error) {
		return json({ message: 'Data Not Found' }, { status: 404 });
	}
}
