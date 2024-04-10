import type { UserProfileRepository } from '$lib/repositories/UserProfileRepository';
import type { Result } from '$lib/utils/result';

export class GetAttendanceCountByModuleUseCase {
	constructor(private userProfileRepository: UserProfileRepository) {}

	async execute(module_id: string): Promise<Result<string, Error>> {
		return this.userProfileRepository.getAttendanceCountByModule(module_id);
	}
}
