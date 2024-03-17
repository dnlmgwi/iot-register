<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import BarGraph from '$lib/components/BarGraph.svelte';
	import profileSchema from '$lib/schemas/profileSchema';
	import toast from 'svelte-french-toast';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

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
				// Successful post! Do some more client-side stuff,
				// like showing a toast notification.
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
		$form.avatar_url = event.detail.url; // Update the parent's variable with the new URL
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
	<div class="p-10">
		<div class="flex justify-center items-center h-full">
			<div class="flex justify-center">
				<form
					class="form-widget"
					method="post"
					action="?/update"
					use:enhance
					on:submit|preventDefault={handleSubmit}
				>
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
									<p class="text-base leading-7 text-blue-600">Total Attendance</p>
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
				</form>
			</div>
		</div>
	</div>
</div>
