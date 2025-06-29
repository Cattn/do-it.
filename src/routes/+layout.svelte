<script lang="ts">
	import '../app.css';
	import '../main.css';
	import TopBar from '$lib/components/TopBar.svelte';
	import { onMount } from 'svelte';
	import { setup } from '$lib/setup.svelte';

	let { children } = $props();

	let tasksStore = $state();
	let taskListsStore = $state();
	let pointsStore = $state();

	onMount(async () => {
		const { tasksStore: ts, taskListsStore: tls, pointsStore: ps } = await setup();
		tasksStore = ts;
		taskListsStore = tls;
		pointsStore = ps;
	});

	$effect(() => {
		console.log(tasksStore);
		console.log(taskListsStore);
		console.log(pointsStore);
	});
</script>     

<TopBar />
{@render children()}  
