<script lang="ts">
	import '../app.css';
	import '../main.css';
	import TopBar from '$lib/components/TopBar.svelte';
	import { onMount } from 'svelte';
	import { setup } from '$lib/setup.svelte';
	import { curPage, initializeStores } from '$lib/store.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	let tasksStore = $state();
	let taskListsStore = $state();
	let papersStore = $state();
	let tasksGameStore = $state();
	let pointsStore = $state();
	let multipliersStore = $state();
	let shopStore = $state();

	onMount(async () => {
		const { 
			tasksStore: ts, 
			taskListsStore: tls, 
			papersStore: ps,
			tasksGameStore: tgs,
			multipliersStore: ms,
			shopStore: ss,
			pointsStore: pts,
			initialTasks,
			initialTaskLists
		} = await setup();
		
		tasksStore = ts;
		taskListsStore = tls;
		papersStore = ps;
		tasksGameStore = tgs;
		multipliersStore = ms;
		shopStore = ss;
		pointsStore = pts;
		
		initializeStores(ts, tls, ps, tgs, pts, ms, ss, initialTasks, initialTaskLists);
	});

	$effect(() => {
		curPage.gamePage = page.url.pathname.includes('game');
		curPage.taskPage = page.url.pathname === '/';
	});
</script>     

<TopBar />
{@render children()}  
