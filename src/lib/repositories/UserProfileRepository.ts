import type { ProfileValueObject } from '$lib/ValueObjects/Profile';
import type { Profile } from '$lib/entities/Profile';
import type { SupabaseClient } from '@supabase/supabase-js';

export class UserProfileRepository {
	constructor(private supabase: SupabaseClient) {}

	async getUserProfile(userId: string): Promise<Profile | null> {
		const { data } = await this.supabase
			.from('profile')
			.select('student_id, student_name, avatar_url')
			.eq('id', userId)
			.single();

		return data ? data : null;
	}

	async updateUserProfile(profile: ProfileValueObject): Promise<Error | null> {
		const { error } = await this.supabase.from('profile').upsert(profile);

		return error == null ? error : new Error(error.message);
	}

	async uploadProfilePicture(userId: string, file: File): Promise<string> {
		const { error, data } = await this.supabase.storage
			.from('uploads')
			.upload(`${userId}/${file.name}`, file);

		if (error) {
			throw new Error(error.message);
		}

		if (!data) {
			throw new Error('Upload failed without a specific error.');
		}

		return data.path;
	}

	async downloadImage(path: string): Promise<Blob> {
		const { data, error } = await this.supabase.storage.from('uploads').download(path);

		if (error) {
			throw Error(error.message);
		}

		if (!data) {
			throw new Error('Fetching failed without a specific error.');
		}

		return data;
	}

	async getPublicUrl(path: string): Promise<string> {
		const { data } = await this.supabase.storage.from('uploads').getPublicUrl(path);

		if (!data) {
			throw new Error('Fetching failed without a specific error.');
		}

		return data.publicUrl;
	}

	async GetTotalAttendanceCount(student_id: string) {
		const { count, error } = await this.supabase
			.from('register')
			.select('*', { count: 'exact' })
			.eq('student_id', student_id);

		if (error) {
			throw new Error(error.message);
		}

		if (!count) {
			throw new Error('Failed without a specific error.');
		}

		return count;
	}

	async GetAverageEntryTime(student_id: string) {
		const { data, error } = await this.supabase
			.from('register')
			.select('created_at')
			.eq('student_id', student_id);

		if (error) {
			console.error('Error fetching data:', error.message);
			return;
		}

		const timesInMinutes = data.map(({ created_at }) => {
			const time = new Date(created_at);
			return time.getHours() * 60 + time.getMinutes();
		});

		const averageTimeInMinutes =
			timesInMinutes.reduce((acc, curr) => acc + curr, 0) / timesInMinutes.length;

		const averageHours = Math.floor(averageTimeInMinutes / 60);
		const averageMinutes = Math.floor(averageTimeInMinutes % 60);

		const averageTime = `${averageHours.toString().padStart(2, '0')}:${averageMinutes.toString().padStart(2, '0')}`;

		return averageTime;
	}

	// async GetAttendanceAndGroupByDate(student_id: string): Promise<AttendanceByDateArray> {
	// 	const { data, error } = await this.supabase
	// 		.from('register')
	// 		.select('created_at')
	// 		.eq('student_id', student_id);

	// 	if (error) {
	// 		throw new Error(error.message);
	// 	}

	// 	if (!data) {
	// 		throw new Error('Failed without a specific error.');
	// 	}

	// 	// Transform and group data by month
	// 	const attendanceByMonth = data.reduce((acc, item) => {
	// 		const date = new Date(item.created_at);
	// 		const yearMonth = date.toISOString().substring(0, 7); // Format: YYYY-MM
	// 		if (!acc[yearMonth]) {
	// 			acc[yearMonth] = []; // Initialize the array if not exist
	// 		}
	// 		// Assuming you want to count attendance or add specific records
	// 		acc[yearMonth].push({
	// 			// Assuming 'framework' and 'score' are placeholders for actual attendance details
	// 			// Replace or adjust the following with real data or structure as needed
	// 			date: date.toISOString(),
	// 			attendance: 'Present' // This is a placeholder. Use actual data or calculation
	// 		});
	// 		return acc;
	// 	}, {});

	// 	// Format the result in the desired structure
	// 	const result = Object.keys(attendanceByMonth).reduce((acc, month) => {
	// 		// Optionally, transform or summarize the data for each month here
	// 		acc[month] = attendanceByMonth[month]; // Direct assignment; customize as needed
	// 		return acc;
	// 	}, {});

	// 	return result;
	// }

	// async getTotalDaysMissed(student_id: string, startDate: Date, endDate: Date) {
	// 	const { data, error } = await this.supabase
	// 		.from('attendance')
	// 		.select('date, attended')
	// 		.eq('student_id', student_id)
	// 		.gte('date', startDate)
	// 		.lte('date', endDate);

	// 	if (error) {
	// 		throw new Error(error.message);
	// 	}

	// 	if (!data) {
	// 		throw new Error('Failed without a specific error.');
	// 	}

	// 	const missedDays = data.filter((record) => !record.attended).length;

	// 	return missedDays;
	// }
}
