import { updateProfileData } from '$lib/ValueObjects/Profile.js';
import profileSchema from '$lib/schemas/profileSchema.js';
import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetUserProfileUseCase } from '$lib/useCases/GetUserProfile.js';
import { UpdateUserProfileUseCase } from '$lib/useCases/UpdateUserProfile';

import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { GetAverageEntryTimeUseCase } from '$lib/useCases/GetAverageEntryTime';
import { GetTotalAttendanceCountUseCase } from '$lib/useCases/GetTotalAttendanceCount';

export const load = async ({ locals: { supabase, getSession }, request }) => {
	const form = await superValidate(request, profileSchema);

	const session = await getSession();

	if (!session) {
		throw redirect(303, '/');
	}

	const userProfileRepository = new UserProfileRepository(supabase);
	const getUserProfile = new GetUserProfileUseCase(userProfileRepository);
	const profile = await getUserProfile.execute(session.user.id);

	if (!profile) {
		throw redirect(303, '/');
	}

	//Get Stats
	const getAverageEntryTime = new GetAverageEntryTimeUseCase(userProfileRepository);
	const getTotalAttendanceCount = new GetTotalAttendanceCountUseCase(userProfileRepository);

	const attendanceCount = await getTotalAttendanceCount.execute(profile.student_id);
	const attendanceAvgEntryTime = await getAverageEntryTime.execute(profile.student_id);

	return {
		session,
		profile,
		form,
		stats: {
			attendanceCount: attendanceCount,
			attendanceAvgEntryTime: attendanceAvgEntryTime
		}
	};
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

		console.log(form.data);

		const profileData = updateProfileData(session, form.data);

		console.log(profileData);

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
