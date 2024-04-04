import type { AttendanceData } from '$lib/entities/Student';
import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class GetAttendanceCountUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(): Promise<AttendanceData[]> {
		return this.userProfileRepository.getAttendanceCount();
	}
}
