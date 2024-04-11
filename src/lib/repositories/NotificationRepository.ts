import type { Result } from '$lib/utils/result';

export class NotificationRepository {
	async getUserProfile(userId: string): Promise<Result<string, null>> {
		const data = userId;

		if (!userId) {
			return { kind: 'error', error: null };
		}

		return { kind: 'success', data: data };
	}
}
