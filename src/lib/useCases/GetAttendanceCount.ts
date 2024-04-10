import type { AttendanceData } from '$lib/entities/Student';
import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Result } from '$lib/utils/result';

export class GetAttendanceCountUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(): Promise<Result<AttendanceData[], Error>> {
		return this.userProfileRepository.getAttendanceCount();
	}
}
