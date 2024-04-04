<script lang="ts">
	import type { AttendanceData } from '$lib/entities/Student';
	import { TrophyIcon } from '@indaco/svelte-iconoir/trophy';

	export let data: AttendanceData[] = [];
</script>

<div class="flex flex-col rounded-lg p-4 max-w-sm">
	<div class="rounded-lg bg-card text-card-foreground shadow-sm w-full max-w-3xl select-none">
		<div class="flex flex-col space-y-1.5 p-6 pb-0 mb-3">
			<h3
				class="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight text-blue-600"
			>
				Leaderboard
			</h3>
			<p class="text-sm text-muted-foreground text-blue-500">Top 15 Overall Attendance</p>
		</div>
		<div class="p-0">
			<div class="overflow-hidden rounded-lg border border-blue-500 dark:border-gray-800">
				<div class="relative w-full overflow-auto">
					<table class="w-full caption-bottom text-sm">
						<thead class="[&amp;_tr]:border-b"
							><tr
								class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
								><th
									class="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-8 text-blue-600"
									>Rank</th
								><th
									class="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-blue-600"
									>Name</th
								><th
									class="h-12 px-4 align-middle font-medium text-muted-foreground text-right text-blue-600"
									>Days</th
								></tr
							></thead
						><tbody class="[&amp;_tr:last-child]:border-0">
							{#each data as { student_id, count, student_name, avatar_url }, index}
								{#if index === 0}
									<tr
										class="border-b transition-colors hover:bg-muted/50 shadow-lg"
										data-state="selected:bg-muted"
									>
										<td class="p-4 align-middle font-semibold">
											<p class="text-blue-600">{index + 1}</p>
										</td>
										<td class="p-4 align-middle">
											<div class="flex items-center space-x-2">
												<img
													src={avatar_url}
													alt={student_name}
													class="w-12 h-12 rounded-full object-cover"
												/>
												<p class="text-blue-600">{student_name}</p>
											</div>
										</td>
										<td class="p-4 align-middle text-right text-blue-600">
											<div class="flex justify-self-center items-center space-x-2">
												<TrophyIcon class="text-blue-600" />

												<p class="text-blue-600">{count}</p>
											</div></td
										>
									</tr>
								{:else}
									<tr
										class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
										><td
											class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-semibold text-blue-600"
											>{index + 1}</td
										><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"
											><div class="flex items-center space-x-2">
												<img
													src={avatar_url}
													alt={student_name}
													class="w-12 h-12 rounded-full object-cover"
												/>
												<p class="text-blue-600">{student_name}</p>
											</div></td
										><td
											class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right text-blue-600"
										>
											<p class="text-blue-600">{count}</p>
										</td></tr
									>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
