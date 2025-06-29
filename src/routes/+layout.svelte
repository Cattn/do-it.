<script lang="ts">
	import '../app.css';
	import '../main.css';
	import TopBar from '$lib/components/TopBar.svelte';
	import { onMount } from 'svelte';
	import { setup } from '$lib/setup.svelte';
	import { curPage } from '$lib/store.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

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
		curPage.gamePage = page.url.pathname.includes('game');
		curPage.taskPage = page.url.pathname === '/';
	});

	$effect(() => {
		console.log(tasksStore);
		console.log(taskListsStore);
		console.log(pointsStore);
		console.log(curPage.gamePage);
		console.log(curPage.taskPage);
	});
</script>     

<TopBar />
{@render children()}  
