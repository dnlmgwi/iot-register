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
</main>
