<script lang="ts">
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import type { PageData } from './$types';
	import Leaderboard from '$lib/components/Leaderboard.svelte';

	export let data: PageData;

	onMount(() => {});

	$: ({ attendaceCount } = data);
</script>

<main class="flex flex-col items-center justify-center min-h-screen">
	<Toaster />
	<Leaderboard data={attendaceCount}></Leaderboard>
	<div class="mt-6 flex items-center justify-between gap-x-6">
		<a href="/" class="text-base font-semibold leading-7 text-blue-600"
			><button
				class="rounded-full border-2 border-blue-600 px-6 py-4 text-sm font-semibold text-blue-600 hover:bg-blue-600 hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600"
			>
				Back</button
			></a
		>
	</div>
</main>
