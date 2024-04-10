import type { MonthlyAttendance, RegisterRow } from '$lib/ValueObjects/MonthlyAttendance';
import type { ProfileValueObject } from '$lib/ValueObjects/Profile';
import type { Profile } from '$lib/entities/Profile';
import type { AttendanceData } from '$lib/entities/Student';
import { addAttendanceRating } from '$lib/utils/attendanceRating';
import type { Result } from '$lib/utils/result';
import type { SupabaseClient } from '@supabase/supabase-js';

export class UserProfileRepository {
	constructor(private supabase: SupabaseClient) {}

	async getUserProfile(userId: string): Promise<Result<Profile, Error>> {
		const { data, error } = await this.supabase
			.from('profile')
			.select('student_id, student_name, avatar_url')
			.eq('id', userId)
			.single();

		if (error) {
			return { kind: 'error', error: Error(error.message) };
		}

		if (!data) {
			return { kind: 'error', error: Error('Data Not Found') };
		}

		return { kind: 'success', data: data };
	}

	async getUserProfileByStudentID(student_id: string): Promise<Result<Profile, Error>> {
		const { data, error } = await this.supabase
			.from('profile')
			.select('student_id, student_name, avatar_url')
			.eq('student_id', student_id)
			.single();

		if (error) {
			return { kind: 'error', error: Error(error.message) };
		}

		if (!data) {
			return { kind: 'error', error: Error('Data Not Found') };
		}

		return { kind: 'success', data: data };
	}

	async updateUserProfile(profile: ProfileValueObject): Promise<Result<null, Error>> {
		const { error } = await this.supabase.from('profile').upsert(profile);

		if (error) {
			return { kind: 'error', error: Error(error.message) };
		}

		return { kind: 'success', data: null };
	}

	async uploadProfilePicture(userId: string, file: File): Promise<Result<string, Error>> {
		const { error, data } = await this.supabase.storage
			.from('uploads')
			.upload(`${userId}/${file.name}`, file);

		if (error) {
			return { kind: 'error', error: Error(error.message) };
		}

		if (!data) {
			return { kind: 'error', error: Error('No Data Found') };
		}

		return { kind: 'success', data: data.path };
	}

	async downloadImage(path: string): Promise<Result<Blob, Error>> {
		const { data, error } = await this.supabase.storage.from('uploads').download(path);

		if (error) {
			return { kind: 'error', error: Error(error.message) };
		}

		if (!data) {
			return { kind: 'error', error: Error('No Data Found') };
		}

		return { kind: 'success', data: data };
	}

	async getPublicUrl(path: string): Promise<Result<string, Error>> {
		const { data } = await this.supabase.storage.from('uploads').getPublicUrl(path);

		if (!data) {
			return { kind: 'error', error: Error('No Data Found') };
		}

		return { kind: 'success', data: data.publicUrl };
	}

	async getTotalAttendanceCount(student_id: string): Promise<Result<number, Error>> {
		const { error, count } = await this.supabase
			.from('register')
			.select('*', { count: 'exact' })
			.eq('student_id', student_id);

		if (error) {
			return { kind: 'error', error: Error(error.message) };
		}

		if (count === null) {
			return { kind: 'error', error: Error('No Data Found') };
		}

		return { kind: 'success', data: count };
	}

	async getAverageEntryTime(student_id: string): Promise<Result<string, Error>> {
		const { data, error } = await this.supabase
			.from('register')
			.select('created_at')
			.eq('student_id', student_id);

		if (error) {
			return { kind: 'error', error: Error(error.message) };
		}

		if (data.length === 0) {
			return { kind: 'error', error: Error('No Data Found') };
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

		return {
			kind: 'success',
			data: `${averageHours.toString().padStart(2, '0')}:${averageMinute.toString().padStart(2, '0')}`
		};
	}

	async getAttendanceCount(): Promise<Result<AttendanceData[], Error>> {
		const { data, error } = await this.supabase.rpc('get_student_attendance_count');

		if (error) {
			return { kind: 'error', error: Error(error.message) };
		}

		return { kind: 'success', data: data };
	}

	async getAttendanceCountTop15(): Promise<Result<AttendanceData[], Error>> {
		const { data, error } = await this.supabase.rpc('get_student_attendance_count_top_15');

		if (error) {
			return { kind: 'error', error: Error(error.message) };
		}
		return { kind: 'success', data: data };
	}

	async getAttendanceCountByModule(module_id: string): Promise<Result<string, Error>> {
		const { data, error } = await this.supabase.rpc('get_student_attendance_count_by_module', {
			module_id: module_id
		});

		if (data.length === 0) {
			return { kind: 'error', error: Error('No Data Found') };
		}

		if (error) {
			return { kind: 'error', error: Error(error.message) };
		}

		return { kind: 'success', data: data };
	}

	async registerStudent(student_id: string, device_id: string): Promise<Result<string, Error>> {
		const { data, error } = await this.supabase.rpc('register_student', {
			device_id_param: device_id,
			student_id: student_id
		});

		if (error) {
			return { kind: 'error', error: Error(error.message) };
		}

		return { kind: 'success', data: data };
	}

	async getAttendanceCountByModuleWithRating(
		module_id: string
	): Promise<Result<AttendanceData[], Error>> {
		const { data, error } = await this.supabase.rpc('get_student_attendance_count_by_module', {
			module_id: module_id
		});

		if (data.length === 0) {
			return { kind: 'error', error: Error('No Data Found') };
		}

		// Calculate ratings
		const attendanceWithRatings = addAttendanceRating(data);

		if (error) {
			return { kind: 'error', error: Error(error.message) };
		}

		return { kind: 'success', data: attendanceWithRatings };
	}

	async getTotalAttendancePerMonth(
		student_id: string
	): Promise<Result<MonthlyAttendance[], Error>> {
		// Assuming 'this.supabase' is properly typed elsewhere in your code.
		const { data, error } = await this.supabase
			.from('register')
			.select('created_at')
			.eq('student_id', student_id);

		if (error) {
			return { kind: 'error', error: Error(error.message) };
		}

		if (!data) {
			return { kind: 'error', error: Error('No Data Found') };
		}

		const monthAttendance = data.reduce((acc: Record<string, number>, row: RegisterRow) => {
			const monthYear = new Date(row.created_at).toLocaleString('default', {
				month: 'short',
				year: 'numeric'
			});
			acc[monthYear] = (acc[monthYear] || 0) + 1;
			return acc;
		}, {});

		const totalAttendancePerMonth = Object.entries(monthAttendance).map(
			([Month, AttendanceCount]): MonthlyAttendance => ({
				Month,
				AttendanceCount
			})
		);

		return {
			kind: 'success',
			data: totalAttendancePerMonth
		};
	}
}
