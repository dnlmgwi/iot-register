import { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import { GetAttendanceCountTop15UseCase } from '$lib/useCases/GetAttendanceCountTop15.js';

export const prerender = true;

export const load = async ({ locals: { supabase } }) => {
	const userProfileRepository = new UserProfileRepository(supabase);
	const getAttendanceCount = new GetAttendanceCountTop15UseCase(userProfileRepository);

	const result = await getAttendanceCount.execute();

	if (result.kind === 'success') {
		return { attendaceCount: result.data };
	} else {
		return { attendaceCount: 0 };
	}
};
