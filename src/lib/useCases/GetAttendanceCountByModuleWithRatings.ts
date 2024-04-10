import type { AttendanceData } from '$lib/entities/Student';
import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Result } from '$lib/utils/result';

export class GetAttendanceCountByModuleWithRatingUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(module_id: string): Promise<Result<AttendanceData[], Error>> {
		return this.userProfileRepository.getAttendanceCountByModuleWithRating(module_id);
	}
}
