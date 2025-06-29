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
			initialTasks,
			initialTaskLists
		} = await setup();
		
		tasksStore = ts;
		taskListsStore = tls;
		papersStore = ps;
		tasksGameStore = tgs;
		multipliersStore = ms;
		shopStore = ss;
		
		initializeStores(ts, tls, ps, tgs, ms, ss, initialTasks, initialTaskLists);
	});

	$effect(() => {
		curPage.gamePage = page.url.pathname.includes('game');
		curPage.taskPage = page.url.pathname === '/';
	});

	$effect(() => {
		console.log(tasksStore);
		console.log(taskListsStore);
		console.log(papersStore);
		console.log(tasksGameStore);
		console.log(multipliersStore);
		console.log(shopStore);
		console.log(curPage.gamePage);
		console.log(curPage.taskPage);
	});
</script>     

<TopBar />
{@render children()}  
