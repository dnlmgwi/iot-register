import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class GetAttendanceCountUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute() {
		return this.userProfileRepository.getAttendanceCount();
	}
}
