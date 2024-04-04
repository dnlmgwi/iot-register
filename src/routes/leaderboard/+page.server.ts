import { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import { GetAttendanceCountUseCase } from '$lib/useCases/GetAttendanceCount';

export const prerender = true;

export const load = async ({ locals: { supabase } }) => {
	const userProfileRepository = new UserProfileRepository(supabase);
	const getAttendanceCount = new GetAttendanceCountUseCase(userProfileRepository);

	const attendaceCount = await getAttendanceCount.execute();

	return { attendaceCount };
};
