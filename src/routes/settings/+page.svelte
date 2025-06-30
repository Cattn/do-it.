<script lang="ts">
    import { Button } from "m3-svelte";
    import { taskStore, taskListStore, gameStore } from "$lib/store.svelte";
    import { SHOP_ITEMS, MULTIPLIER_ITEMS } from "$lib/shop";
    import { onMount } from "svelte";

    let isExporting = $state(false);
    let storesReady = $state(false);

    onMount(async () => {
        await waitForStores();
    });

    async function waitForStores() {
        while (true) {
            try {
                await gameStore.getPoints();
                storesReady = true;
                break;
            } catch (error) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    }

    async function exportData() {
        if (!storesReady) return;
        
        isExporting = true;
        
        try {
            const tasks = taskStore.tasks;
            const taskLists = taskListStore.taskLists;
            
            const papers = await gameStore.getPapers();
            const tasksCount = await gameStore.getTasks();
            const points = await gameStore.getPoints();
            
            const shopData = await Promise.all(
                SHOP_ITEMS.map(async (item) => ({
                    key: item.key,
                    name: item.name,
                    level: await gameStore.getUpgradeLevel(item.key)
                }))
            );
            
            const multiplierData = await Promise.all(
                MULTIPLIER_ITEMS.map(async (item) => ({
                    key: item.key,
                    name: item.name,
                    owned: await gameStore.getShopItem(item.key)
                }))
            );
            
            const exportData = {
                exportInfo: {
                    version: "1.0",
                    exportDate: new Date().toISOString(),
                    appName: "do it!"
                },
                tasks: tasks.map(task => ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    reward: task.reward,
                    uploadedAt: task.uploadedAt.toISOString(),
                    completed: task.completed
                })),
                taskLists: taskLists.map(list => ({
                    id: list.id,
                    title: list.title,
                    tasks: list.tasks,
                    uploadedAt: list.uploadedAt.toISOString(),
                    reward: list.reward,
                    completed: list.completed
                })),
                gameProgress: {
                    papers,
                    tasks: tasksCount,
                    points,
                    shopUpgrades: shopData.filter(item => item.level > 0),
                    multipliers: multiplierData.filter(item => item.owned)
                },
                statistics: {
                    totalTasks: tasks.length,
                    completedTasks: tasks.filter(t => t.completed).length,
                    activeTasks: tasks.filter(t => !t.completed).length,
                    totalTaskLists: taskLists.length,
                    completedTaskLists: taskLists.filter(tl => tl.completed).length,
                    activeTaskLists: taskLists.filter(tl => !tl.completed).length
                }
            };
            
            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `do-it-export-${timestamp}.json`;
            
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            isExporting = false;
        }
    }
</script>

<div class="bg-secondary-container mt-10 mx-5 pb-5 rounded-t-3xl">
    <div class="mx-4 pt-4 pb-4">
        <h1 class="text-2xl font-bold text-on-secondary-container mb-6">Settings</h1>
        
        <div class="bg-surface-container-low p-6 rounded-lg flex flex-col">
            <h2 class="text-xl font-semibold mb-4 text-on-surface mt-6 ml-2">Data Management</h2>
            
            <div class="flex flex-col gap-6 ml-2 mb-4">
                <div class="flex flex-col gap-3">
                    <h3 class="text-xl font-medium text-on-surface">Export Data</h3>
                    <p class="text-on-surface-variant text-sm leading-relaxed">
                        Download all your tasks, progress, and game data as a JSON file for backup or transfer.
                    </p>
                    <div class="flex gap-2">
                        <Button 
                            variant="filled" 
                            click={exportData}
                            disabled={isExporting || !storesReady}
                        >
                            {#if isExporting}
                                Exporting...
                            {:else if !storesReady}
                                Loading...
                            {:else}
                                Export Data
                            {/if}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>