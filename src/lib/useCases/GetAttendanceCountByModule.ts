import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';

export class GetAttendanceCountByModuleUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(module_id: string) {
		return this.userProfileRepository.getAttendanceCountByModule(module_id);
	}
}
