import type { MonthlyAttendance, RegisterRow } from '$lib/ValueObjects/MonthlyAttendance';
import type { ProfileValueObject } from '$lib/ValueObjects/Profile';
import type { Profile } from '$lib/entities/Profile';
import { addAttendanceRating } from '$lib/utils/attendanceRating';
import type { SupabaseClient } from '@supabase/supabase-js';

export class UserProfileRepository {
	constructor(private supabase: SupabaseClient) {}

	async getUserProfile(userId: string): Promise<Profile> {
		const { data, error } = await this.supabase
			.from('profile')
			.select('student_id, student_name, avatar_url')
			.eq('id', userId)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		if (!data) {
			throw new Error('Fetch failed without a specific error.');
		}

		return data;
	}

	async getUserProfileByStudentID(student_id: string): Promise<Profile> {
		const { data, error } = await this.supabase
			.from('profile')
			.select('student_id, student_name, avatar_url')
			.eq('student_id', student_id)
			.single();

		if (error) {
			throw new Error(error.message);
		}

		if (!data) {
			throw new Error('Fetch failed without a specific error.');
		}

		return data;
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

	async getTotalAttendanceCount(student_id: string) {
		const { error, count } = await this.supabase
			.from('register')
			.select('*', { count: 'exact' })
			.eq('student_id', student_id);

		if (error) {
			throw new Error(error.message);
		}

		return count;
	}

	async getAverageEntryTime(student_id: string): Promise<string> {
		const { data, error } = await this.supabase
			.from('register')
			.select('created_at')
			.eq('student_id', student_id);

		if (error) {
			console.error('Error fetching data:', error);
			throw Error(error.message);
		}

		if (data.length === 0) {
			return 'No data available';
		}

		const timezoneOffsetHours = 2; // For +02:00 timezone
		const totalMinutes = data.reduce((acc, { created_at }) => {
			const time = new Date(created_at);
			// Adjust for timezone difference from UTC
			const adjustedTime = new Date(time.getTime() + timezoneOffsetHours * 60 * 60 * 1000);
			return acc + (adjustedTime.getUTCHours() * 60 + adjustedTime.getUTCMinutes());
		}, 0);

		const averageMinutes = totalMinutes / data.length;
		const averageHours = Math.floor(averageMinutes / 60);
		const averageMinute = Math.round(averageMinutes % 60);

		return `${averageHours.toString().padStart(2, '0')}:${averageMinute.toString().padStart(2, '0')}`;
	}

	async getAttendanceCount() {
		const { data, error } = await this.supabase.rpc('get_student_attendance_count');

		if (error) {
			throw new Error(error.message);
		}

		return data;
	}

	async getAttendanceCountByModule(module_id: string) {
		const { data, error } = await this.supabase.rpc('get_student_attendance_count_by_module', {
			module_id: module_id
		});

		if (data.length === 0) {
			throw new Error('No data found');
		}

		if (error) {
			throw new Error(error.message);
		}

		return data;
	}

	async getAttendanceCountByModuleWithRating(module_id: string) {
		const { data, error } = await this.supabase.rpc('get_student_attendance_count_by_module', {
			module_id: module_id
		});

		if (data.length === 0) {
			throw new Error('No data found');
		}

		// Calculate ratings
		const attendanceWithRatings = addAttendanceRating(data);

		if (error) {
			throw new Error(error.message);
		}

		return attendanceWithRatings;
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

	async getTotalAttendancePerMonth(student_id: string): Promise<MonthlyAttendance[]> {
		// Assuming 'this.supabase' is properly typed elsewhere in your code.
		const { data, error } = await this.supabase
			.from('register')
			.select('created_at')
			.eq('student_id', student_id);

		if (error) {
			throw new Error(error.message);
		}

		if (!data) {
			throw new Error('Fetching failed without a specific error.');
		}

		const monthAttendance = data.reduce((acc: Record<string, number>, row: RegisterRow) => {
			const monthYear = new Date(row.created_at).toLocaleString('default', {
				month: 'short',
				year: 'numeric'
			});
			acc[monthYear] = (acc[monthYear] || 0) + 1;
			return acc;
		}, {});

		return Object.entries(monthAttendance).map(
			([Month, AttendanceCount]): MonthlyAttendance => ({
				Month,
				AttendanceCount
			})
		);
	}
}
