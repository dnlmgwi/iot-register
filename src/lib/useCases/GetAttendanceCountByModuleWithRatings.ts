import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class GetAttendanceCountByModuleWithRatingUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(module_id: string) {
		return this.userProfileRepository.getAttendanceCountByModuleWithRating(module_id);
	}
}
