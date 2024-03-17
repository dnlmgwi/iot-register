import { updateProfileData } from '$lib/ValueObjects/Profile.js';
import profileSchema from '$lib/schemas/profileSchema.js';
import { UserProfileRepository } from '$lib/repositories/UserProfileRepository.js';
import { GetUserProfileUseCase } from '$lib/useCases/GetUserProfile.js';
import { UpdateUserProfileUseCase as UpdateUserProfileUseCase } from '$lib/useCases/UpdateUserProfile';

import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { GetTotalAttendanceAndGroupByDay } from '$lib/useCases/GetTotalAttendanceAndGroupByMonth';
import { GetTotalAttendanceCount } from '$lib/useCases/GetTotalAttendanceCount';

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
	// const getTotalAttendanceAndGroupByDay = new GetTotalAttendanceAndGroupByDay(
	// 	userProfileRepository
	// );
	const getTotalAttendanceCount = new GetTotalAttendanceCount(userProfileRepository);

	const attendanceCount = await getTotalAttendanceCount.execute(profile.student_id);
	// const attendanceAndGroupByDay = await getTotalAttendanceAndGroupByDay.execute(profile.student_id);

	return {
		session,
		profile,
		form,
		stats: {
			attendanceCount: attendanceCount
			// attendanceAndGroupByMonth: attendanceAndGroupByDay
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
