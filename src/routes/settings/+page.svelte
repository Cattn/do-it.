<script lang="ts">
    import { Button, Switch, Card, Dialog } from "m3-svelte";
    import { taskStore, taskListStore, gameStore, uiStore } from "$lib/store.svelte";
    import { SHOP_ITEMS, MULTIPLIER_ITEMS } from "$lib/shop";
    import { onMount } from "svelte";

    let isExporting = $state(false);
    let storesReady = $state(false);
    let isClearing = $state(false);
    let showClearConfirmation = $state(false);

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

    function togglePapersPerSecond() {
        uiStore.showPapersPerSecond = !uiStore.showPapersPerSecond;
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

    async function clearAllData() {
        if (!storesReady) return;
        
        isClearing = true;
        
        try {
            await taskStore.clearCompleted();
            const activeTasks = taskStore.activeTasks;
            for (const task of activeTasks) {
                await taskStore.delete(task.id);
            }
            
            const activeTaskLists = taskListStore.activeTaskLists;
            for (const taskList of activeTaskLists) {
                await taskListStore.delete(taskList.id);
            }
            
            await gameStore.setPapers(0);
            await gameStore.setTasks(0);
            await gameStore.setPoints(0);
            
            for (const item of SHOP_ITEMS) {
                await gameStore.purchaseShopItem(item.key);
                const currentLevel = await gameStore.getUpgradeLevel(item.key);
                for (let i = 0; i < currentLevel; i++) {
                }
            }
            
            for (const item of MULTIPLIER_ITEMS) {
                await gameStore.purchaseShopItem(item.key);
            }
            
            localStorage.removeItem('showPapersPerSecond');
            uiStore.showPapersPerSecond = true;
            
            alert('All data has been cleared successfully.');
            
        } catch (error) {
            console.error('Clear data failed:', error);
            alert('Failed to clear data. Please try again.');
        } finally {
            isClearing = false;
            showClearConfirmation = false;
        }
    }

    function handleClearConfirmation() {
        showClearConfirmation = true;
    }

    function cancelClear() {
        showClearConfirmation = false;
    }
</script>

<div class="bg-secondary-container mt-10 mx-5 pb-8 rounded-t-3xl">
    <div class="mx-6 pt-6">
        <h1 class="text-on-secondary-container title-text mb-8">Settings</h1>
        
        <div class="flex flex-col gap-6">
            <Card variant="elevated">
                <div class="card-content">
                    <div class="section-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-primary">
                            <path fill="currentColor" d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3s-3-1.35-3-3s1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5M2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1m18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1M11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1m0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1M5.99 4.58c-.39-.39-1.03-.39-1.41 0c-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58m12.37 12.37c-.39-.39-1.03-.39-1.41 0c-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0c.39-.39.39-1.03 0-1.41l-1.06-1.06m1.06-10.96c.39-.39.39-1.03 0-1.41c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06M7.05 18.36c.39-.39.39-1.03 0-1.41c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06"/>
                        </svg>
                        <h2 class="m3-font-headline-small text-on-surface">Display Settings</h2>
                    </div>
                    
                    <div class="setting-item">
                        <div class="setting-content">
                            <h3 class="m3-font-title-medium text-on-surface">Papers Per Second Display</h3>
                            <p class="m3-font-body-medium text-on-surface-variant">
                                Toggle the visibility of the papers per second counter in the game page
                            </p>
                        </div>
                        <div class="setting-control">
                            <label>
                                <Switch 
                                    bind:checked={uiStore.showPapersPerSecond}
                                    onclick={togglePapersPerSecond}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </Card>

            <Card variant="elevated">
                <div class="card-content">
                    <div class="section-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-primary">
                            <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm4 18H6V4h7v5h5z"/>
                        </svg>
                        <h2 class="m3-font-headline-small text-on-surface">Data Management</h2>
                    </div>
                    
                    <div class="setting-item">
                        <div class="setting-content">
                            <h3 class="m3-font-title-medium text-on-surface">Export Data</h3>
                            <p class="m3-font-body-medium text-on-surface-variant">
                                Download all your tasks, progress, and game data as a JSON file for backup or transfer
                            </p>
                        </div>
                        <div class="setting-control">
                            <Button 
                                variant="filled" 
                                click={exportData}
                                disabled={isExporting || !storesReady}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm-1 11v4h-2v-4H8l4-4l4 4z"/>
                                </svg>
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

                    <div class="setting-item setting-separator">
                        <div class="setting-content">
                            <h3 class="m3-font-title-medium text-error">Clear All Data</h3>
                            <p class="m3-font-body-medium text-on-surface-variant">
                                Permanently delete all tasks, task lists, and game progress. This action cannot be undone
                            </p>
                        </div>
                        <div class="setting-control">
                            <Button 
                                variant="outlined"
                                click={handleClearConfirmation}
                                disabled={isClearing || !storesReady}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/>
                                </svg>
                                {#if isClearing}
                                    Clearing...
                                {:else if !storesReady}
                                    Loading...
                                {:else}
                                    Clear All Data
                                {/if}
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    </div>
</div>

<Dialog 
    bind:open={showClearConfirmation}
    headline="Confirm Clear All Data"
>
    <p class="m3-font-body-large text-on-surface mb-4">
        Are you sure you want to clear all data? This will permanently delete:
    </p>
    <ul class="text-on-surface-variant m3-font-body-medium space-y-2 list-disc ml-6 mb-6">
        <li>All tasks and task lists</li>
        <li>All game progress (papers, tasks currency, points)</li>
        <li>All shop upgrades and multipliers</li>
        <li>All settings preferences</li>
    </ul>
    <div class="warning-banner">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="text-error">
            <path fill="currentColor" d="M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z"/>
        </svg>
        <p class="m3-font-label-large text-error">
            This action cannot be undone!
        </p>
    </div>
    
    {#snippet buttons()}
        <Button variant="outlined" click={cancelClear}>Cancel</Button>
        <Button variant="filled" click={clearAllData} disabled={isClearing}>
            {isClearing ? "Clearing..." : "Yes, Clear All Data"}
        </Button>
    {/snippet}
</Dialog>

<style>
    .card-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.5rem;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
    }

    .setting-item {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1.5rem;
        padding: 0.75rem 0;
    }

    .setting-separator {
        border-top: 1px solid rgb(var(--m3-scheme-outline-variant));
        padding-top: 1.5rem;
        margin-top: 0.75rem;
    }

    .setting-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .setting-control {
        flex-shrink: 0;
        display: flex;
        align-items: center;
    }

    .warning-banner {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        border-radius: 0.5rem;
        background-color: rgb(var(--m3-scheme-error-container));
    }

    .title-text {
        font-size: 32px;
        font-family: "Roboto Flex", sans-serif;
        font-optical-sizing: 32;
        font-weight: 900;
        font-style: normal;
        text-align: center;
        font-variation-settings:
            "slnt" 0,
            "wdth" 151,
            "GRAD" 0,
            "XOPQ" 68,
            "XTRA" 603,
            "YOPQ" 79,
            "YTAS" 750,
            "YTDE" -203,
            "YTFI" 738,
            "YTLC" 514,
            "YTUC" 712;
    }
</style>