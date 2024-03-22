import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetUserProfileByIDUseCase } from '$lib/useCases/GetUserProfileByID.js';
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
		const getUserProfile = new GetUserProfileByIDUseCase(userProfileRepository);
		const profile = await getUserProfile.execute(student_id);

		return json({ profile });
	} catch (error) {
		return json({ message: 'Student ID Not Found' }, { status: 404 });
	}
}
