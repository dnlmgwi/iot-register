<script lang="ts">
	import BarGraph from '$lib/components/BarGraph.svelte';
	import NotificationBanner from '$lib/components/NotificationBanner.svelte';
	import profileSchema from '$lib/schemas/profileSchema';
	import toast from 'svelte-french-toast';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	$: ({ session, profile } = data);

	let disableName: boolean;
	let disableID: boolean;

	const { form, errors, enhance, constraints, delayed } = superForm(data.form, {
		dataType: 'json',
		taintedMessage: null,
		validators: profileSchema,
		multipleSubmits: 'abort',
		scrollToError: 'smooth',
		autoFocusOnError: 'detect',
		// SPA: true,
		onError: 'apply',
		stickyNavbar: 'true',
		onUpdated({ form }) {
			if (form.valid) {
				toast('Profile Updated', { icon: '✅' });
				loading = false;
				disableName = true;
				disableID = true;
			}

			if (!form.valid) {
				if ($form.avatar_url == '') {
					toast.error('Please Upload An Image');
				}

				loading = false;
			}
		}
	});

	let loading = false;

	// disableName = $form.student_name !== null;
	// disableID = $form.student_id !== null;
	let disableEmail = true;

	function handleSubmit() {
		loading = true;
		return async () => {
			loading = false;
		};
	}

	$: {
		if (data.profile) {
			$form = data.profile;
		}
	}

	function handleUpload(event: CustomEvent) {
		$form.avatar_url = event.detail.url;
	}
</script>

{#if data.stats}
	<div class="flex flex-col items-center justify-center min-h-screen">
		<div class="p-10">
			<div class="flex justify-center items-center h-full">
				<div class="flex justify-center">
					<div class="border-b border-gray-900/10 pb-12">
						<h2 class="text-base font-semibold leading-7 text-blue-600">MyStats</h2>
						<p class="mt-1 text-base leading-7 text-blue-600">
							Your overall class attendance stats.
						</p>

						<div class="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
							<div class="sm:col-span-3">
								<div
									class="flex flex-col items-center justify-center border-2 border-blue-600 rounded-md p-3"
								>
									<p class="text-3xl font-semibold leading-7 text-blue-600">
										{data.stats.attendanceCount}
									</p>
									<p class="text-base leading-7 text-blue-200">Total Attendance</p>
								</div>
							</div>
							<div class="sm:col-span-3">
								<div
									class="flex flex-col items-center justify-center border-2 border-blue-600 rounded-md p-3"
								>
									<p class="text-3xl font-semibold leading-7 text-blue-600">
										{data.stats.attendanceAvgEntryTime}
									</p>
									<p class="text-base leading-7 text-blue-200">Avg Entry Time</p>
								</div>
							</div>

							<div class="sm:col-span-6">
								<div
									class="flex flex-col items-center justify-center border-2 border-blue-600 rounded-md p-3"
								>
									<BarGraph data={data.stats.attendanceCountByMonth}></BarGraph>
									<p class="text-base leading-7 text-blue-600">Total Attendance By Month</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="mt-6 flex items-center justify-center gap-x-6">
				<p>
					<a href="/" class="text-base font-semibold leading-7 text-blue-600"
						><button
							class="rounded-full border-2 border-blue-600 px-6 py-4 text-sm font-semibold text-blue-600 hover:bg-blue-600 hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
						>
							Back</button
						></a
					>
				</p>
			</div>
		</div>
	</div>
{:else}
	{#if profile === null || profile.student_id == null}
		<NotificationBanner />
	{/if}
	<div class="flex flex-col items-center justify-center min-h-screen">
		<div class="p-10">
			<div class="flex justify-center items-center h-full">
				<div class="flex justify-center">
					<div class="border-b border-gray-900/10 pb-12">
						<h2 class="text-base font-semibold leading-7 text-blue-600">MyStats Not Found</h2>
						<p class="mt-1 text-base leading-7 text-blue-600">Please complete your profile.</p>
					</div>
				</div>
			</div>
			<div class="mt-6 flex items-center justify-center gap-x-6">
				<p>
					<a href="/" class="text-base font-semibold leading-7 text-blue-600"
						><button
							class="rounded-full border-2 border-blue-600 px-6 py-4 text-sm font-semibold text-blue-600 hover:bg-blue-600 hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
						>
							Back</button
						></a
					>
				</p>
			</div>
		</div>
	</div>
{/if}
