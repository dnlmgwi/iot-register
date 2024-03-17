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
}
