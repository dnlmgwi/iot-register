import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetTotalAttendanceCountUseCase } from '$lib/useCases/GetTotalAttendanceCount.js';
import { rateLimiter } from '$lib/utils/rateLimiter.js';
import { json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	if (rateLimiter(request)) {
		// If the rate limit is exceeded
		return new Response('Rate limit exceeded. Try again later.', { status: 429 });
	}

	const userProfileRepository = new UserProfileRepository(locals.supabase);
	const { student_id } = await request.json();

	if (!student_id) {
		return json({ message: 'Please read the docs' }, { status: 400 });
	}

	try {
		//Get Stats
		const getTotalAttendanceCount = new GetTotalAttendanceCountUseCase(userProfileRepository);

		const count = await getTotalAttendanceCount.execute(student_id);

		return json({ data: count });
	} catch (error) {
		return json({ message: 'Student ID Not Found' }, { status: 404 });
	}
}