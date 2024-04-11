import { updateProfileData } from '$lib/ValueObjects/Profile.js';
import profileSchema from '$lib/schemas/profileSchema.js';
import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetUserProfileUseCase } from '$lib/useCases/GetUserProfile.js';
import { UpdateUserProfileUseCase } from '$lib/useCases/UpdateUserProfile';

import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { GetAverageEntryTimeUseCase } from '$lib/useCases/GetAverageEntryTime';
import { GetTotalAttendanceCountUseCase } from '$lib/useCases/GetTotalAttendanceCount';
import { GetTotalAttendanceCountByMonthUseCase } from '$lib/useCases/GetTotalAttendanceCountByMonth.js';
import type { AttendanceStats } from '$lib/types.js';
import type { MonthlyAttendance } from '$lib/ValueObjects/MonthlyAttendance.js';

export const load = async ({ locals: { supabase, getSession }, request }) => {
	const form = await superValidate(request, profileSchema);

	const session = await getSession();

	if (!session) {
		throw redirect(303, '/');
	}

	const userProfileRepository = new UserProfileRepository(supabase);
	const getUserProfile = new GetUserProfileUseCase(userProfileRepository);

	const result = await getUserProfile.execute(session.user.id);

	if (result.kind === 'success') {
		//Get Stats
		const getAverageEntryTime = new GetAverageEntryTimeUseCase(userProfileRepository);
		const getTotalAttendanceCount = new GetTotalAttendanceCountUseCase(userProfileRepository);
		const getTotalAttendanceCountByMonth = new GetTotalAttendanceCountByMonthUseCase(
			userProfileRepository
		);

		const data: AttendanceStats = {
			attendanceCount: 0.0,
			attendanceAvgEntryTime: '',
			attendanceCountByMonth: []
		};

		const results = await Promise.all([
			getTotalAttendanceCountByMonth.execute(result.data.student_id),
			getTotalAttendanceCount.execute(result.data.student_id),
			getAverageEntryTime.execute(result.data.student_id)
		]);

		results.forEach((result, index) => {
			if (result.kind === 'success') {
				switch (index) {
					case 0:
						data.attendanceCount = result.data as number;
						break;
					case 1:
						data.attendanceAvgEntryTime = result.data as string;
						break;
					case 2:
						data.attendanceCountByMonth = result.data as MonthlyAttendance[];
						break;
				}
			} else {
				console.error(`Operation ${index} failed:`, result.error);
				//TODO: Handle errors appropriately
			}
		});

		return {
			session,
			profile: result.data,
			form,
			stats: { ...data }
		};
	} else {
		return { form, session, profile: null };
	}
};

export const actions = {
	update: async ({ request, locals: { supabase, getSession } }) => {
		const form = await superValidate(request, profileSchema);

		const session = await getSession();

		if (!session) {
			throw redirect(303, '/');
		}

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		const profileData = updateProfileData(session, form.data);

		const userProfileRepository = new UserProfileRepository(supabase);
		const updateUserProfile = new UpdateUserProfileUseCase(userProfileRepository);

		const error = await updateUserProfile.execute(profileData);

		if (error) {
			return fail(500, {
				form
			});
		}

		return {
			form
		};
	}
};
