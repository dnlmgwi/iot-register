import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { RegisterStudentUseCase } from '$lib/useCases/RegisterUser.js';
import { rateLimiter } from '$lib/services/rateLimiter.js';
import { error, json } from '@sveltejs/kit';
import { message } from 'sveltekit-superforms/client';

export async function PUT({ request, locals }) {
	if (rateLimiter(request)) {
		// If the rate limit is exceeded
		return error(429, 'Rate limit exceeded. Try again later.');
	}

	const userProfileRepository = new UserProfileRepository(locals.supabase);
	const { student_id, device_id } = await request.json();

	if (!student_id || !device_id) {
		return error(500, 'Please read the docs');
	}

	//Get Stats
	const registerStudent = new RegisterStudentUseCase(userProfileRepository);

	const result = await registerStudent.execute(student_id, device_id);

	if (result.kind === 'success') {
		if (result.data === null) {
			return json({ message: 'check-in successful' });
		}

		return json(result.data);
	} else {
		error(400, result.error.message);
	}
}
