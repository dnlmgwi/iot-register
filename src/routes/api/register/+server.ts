import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { RegisterStudentUseCase } from '$lib/useCases/RegisterUser.js';
import { rateLimiter } from '$lib/utils/rateLimiter.js';
import { json } from '@sveltejs/kit';

export async function PUT({ request, locals }) {
	if (rateLimiter(request)) {
		// If the rate limit is exceeded
		return new Response('Rate limit exceeded. Try again later.', { status: 429 });
	}

	const userProfileRepository = new UserProfileRepository(locals.supabase);
	const { student_id, device_id } = await request.json();

	if (!student_id || !device_id) {
		return json({ message: 'Please read the docs' }, { status: 400 });
	}

	try {
		//Get Stats
		const registerStudent = new RegisterStudentUseCase(userProfileRepository);

		await registerStudent.execute(student_id, device_id);

		return json({ message: 'Check-In Successful' });
	} catch (error) {
		return json({ message: 'Check-In Failed' }, { status: 400 });
	}
}
