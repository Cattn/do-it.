<script lang="ts">
    import { SHOP_ITEMS, MULTIPLIER_ITEMS } from '$lib/shop';
    import { onMount, onDestroy } from 'svelte';
    import { gameStore, uiStore } from '$lib/store.svelte';
    import { Button } from 'm3-svelte';

    let papers = $state(0);
    let tasks = $state(0);
    let storesReady = $state(false);
    let shopData = $state<Array<{
        item: typeof SHOP_ITEMS[0],
        owned: boolean,
        level: number,
        currentPrice: number,
        isMaxLevel: boolean
    }>>([]);
    let multiplierData = $state<Array<{
        item: typeof MULTIPLIER_ITEMS[0],
        owned: boolean
    }>>([]);
    let purchasedMultipliers = $state<Array<typeof MULTIPLIER_ITEMS[0]>>([]);
    let currentPapersPerSecond = $state(0);
    let papersPerSecondTimer: number;
    let isAnimating = $state(false);

    onMount(async () => {
        await waitForStores();
        await loadGameData();

        papersPerSecondTimer = setInterval(async () => {
            currentPapersPerSecond = await calculateTotalPapersPerSecond();
            if (currentPapersPerSecond > 0) {
                await gameStore.addPapers(Math.round(currentPapersPerSecond));
                papers = await gameStore.getPapers();

                isAnimating = true;
                setTimeout(() => {
                    isAnimating = false;
                }, 300);
            }
        }, 1000);
    });

    onDestroy(() => {
        if (papersPerSecondTimer) {
            clearInterval(papersPerSecondTimer);
        }
    });

    async function calculateTotalPapersPerSecond() {
        let total = 0;
        for (const item of SHOP_ITEMS) {
            const level = await gameStore.getUpgradeLevel(item.key);
            if (level > 0) {
                const itemPps = item.pps * level * Math.pow(item.ppsMultiplier, level - 1);
                total += itemPps;
            }
        }
        
        for (const multiplier of MULTIPLIER_ITEMS) {
            if (multiplier.type === 'paper') {
                const owned = await gameStore.getShopItem(multiplier.key);
                if (owned) {
                    total *= multiplier.multiplier;
                }
            }
        }
        
        return Math.round(total);
    }


    async function waitForStores() {
        while (true) {
            try {
                await gameStore.getPapers();
                storesReady = true;
                break;
            } catch (error) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    }

    async function loadGameData() {
        papers = await gameStore.getPapers();
        tasks = await gameStore.getTasks();
        currentPapersPerSecond = await calculateTotalPapersPerSecond();
        
        const data = await Promise.all(
            SHOP_ITEMS.map(async (item) => {
                const owned = await gameStore.getShopItem(item.key);
                const level = await gameStore.getUpgradeLevel(item.key);
                const isMaxLevel = level >= item.limit;
                const currentPrice = calculatePrice(item.basePrice, level, item.pMultiplier);
                
                return {
                    item,
                    owned,
                    level,
                    currentPrice,
                    isMaxLevel
                };
            })
        );
        
        const multiplierDataResult = await Promise.all(
            MULTIPLIER_ITEMS.map(async (item) => {
                const owned = await gameStore.getShopItem(item.key);
                return {
                    item,
                    owned
                };
            })
        );
        
        shopData = data;
        multiplierData = multiplierDataResult.filter(m => !m.owned);
        purchasedMultipliers = multiplierDataResult.filter(m => m.owned).map(m => m.item);
    }

    function calculatePrice(basePrice: number, level: number, multiplier: number) {
        return Math.floor(basePrice * Math.pow(multiplier, level));
    }

    async function purchaseItem(itemKey: string, price: number, isMaxLevel: boolean = false) {
        if (papers >= price && !isMaxLevel) {
            await gameStore.setPapers(papers - price);
            await gameStore.purchaseUpgrade(itemKey);
            await loadGameData();
        }
    }

    async function purchaseMultiplier(itemKey: string, price: number, type: string) {
        if (tasks >= price) {
            await gameStore.setTasks(tasks - price);
            await gameStore.purchaseShopItem(itemKey);
            await loadGameData();
        }
    }

    function canAfford(price: number, type?: string) {
        if (type === 'click' || type === 'paper') {
            return tasks >= price;
        }
        return papers >= price;
    }

    async function addPaper() {
        let clickValue = 1;
        
        for (const multiplier of MULTIPLIER_ITEMS) {
            if (multiplier.type === 'click') {
                const owned = await gameStore.getShopItem(multiplier.key);
                if (owned) {
                    clickValue *= multiplier.multiplier;
                }
            }
        }
        
        await gameStore.addPapers(Math.round(clickValue));
        await loadGameData();
    }
</script>



<div class="flex flex-row">
    <div class="bg-primary-container h-screen mr-10 mt-10 w-1/3 pb-5 rounded-tr-3xl">
        <div class="flex flex-col text-center mb-4">
            <h1 class="text-on-primary-fixed title-text">Multipliers</h1>
            {#if storesReady}
                <p class="text-on-surface-variant">Tasks: {tasks}</p>
            {/if}
        </div>
        <hr class="border-on-primary-container border-2">
        
        {#if !storesReady}
            <div class="flex justify-center items-center p-8">
                <p class="text-on-surface-variant">Loading...</p>
            </div>
        {:else}
            <div class="flex flex-col gap-4 p-4">
                {#each multiplierData as { item }}
                    <div class="bg-surface-container-low p-4 rounded-lg border-2 border-tertiary">
                        <div class="flex flex-col gap-2">
                            <h2 class="text-on-surface font-bold text-lg">
                                {item.name}
                                <span class="text-tertiary text-sm">(One-time)</span>
                            </h2>
                            
                            <p class="text-on-surface-variant text-sm">{item.description}</p>
                            
                            <div class="flex justify-between items-center">
                                <span class="text-on-surface font-medium">
                                    {item.basePrice} tasks
                                </span>
                                
                                <Button 
                                    variant={canAfford(item.basePrice, item.type) ? "filled" : "outlined"}
                                    disabled={!canAfford(item.basePrice, item.type)}
                                    click={() => purchaseMultiplier(item.key, item.basePrice, item.type)}
                                >
                                    Buy
                                </Button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>


    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="bg-secondary-container ml-10 mr-10 mt-10 w-1/3 pb-5 rounded-t-3xl items-center flex justify-center flex-col">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div 
                onclick={addPaper} 
                class="w-46 h-62 bg-secondary rounded-md mb-40 rotate-20 flex items-center justify-center drop-shadow-lg hover:shadow-xl hover:scale-105 active:shadow-none active:scale-95 transition-all duration-100 {isAnimating ? 'animate-pulse scale-110 shadow-2xl' : ''}"
            >            
            <div class="rounded-full bg-primary-container w-14 h-14 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" class="text-on-primary-container">
                    <path fill="currentColor" d="m12 13.4l-2.917 2.925q-.277.275-.704.275t-.704-.275q-.275-.275-.275-.7t.275-.7L10.6 12L7.675 9.108Q7.4 8.831 7.4 8.404t.275-.704q.275-.275.7-.275t.7.275L12 10.625L14.892 7.7q.277-.275.704-.275t.704.275q.3.3.3.713t-.3.687L13.375 12l2.925 2.917q.275.277.275.704t-.275.704q-.3.3-.712.3t-.688-.3z" />
                </svg>
            </div>
        </div>
        <div class="justify-center flex flex-col neg-margin-top">
            {#if uiStore.showPapersPerSecond}
                <h1 class="text-on-surface-variant text-lg">
                    {Math.round(currentPapersPerSecond)} papers/s
                </h1>
            {/if}
            {#if purchasedMultipliers.length > 0}
                <div class="mt-4 text-center">
                    <h2 class="text-on-surface-variant text-sm mb-2">Active Multipliers:</h2>
                    {#each purchasedMultipliers as multiplier}
                        <p class="text-on-surface text-xs">
                            {multiplier.name}
                        </p>
                    {/each}
                </div>
            {/if}
        </div>
    </div>


    <div class="bg-secondary-container mt-10 w-1/3 pb-5 rounded-tl-3xl ml-10">
        <div class="flex flex-col">
            <h1 class="text-on-primary-fixed title-text">Shop</h1>
            {#if storesReady}
                <div class="text-center mb-4">
                    <p class="text-on-surface-variant">Papers: {Math.round(papers)}</p>
                </div>
            {/if}
        </div>
        <hr class="border-on-secondary-container border-2">
        
        {#if !storesReady}
            <div class="flex justify-center items-center p-8">
                <p class="text-on-surface-variant">Loading...</p>
            </div>
        {:else}
            <div class="flex flex-col gap-4 p-4">
                {#each shopData as { item, owned, level, currentPrice, isMaxLevel }}
                    <div class="bg-surface-container-low p-4 rounded-lg">
                        <div class="flex flex-col gap-2">
                            <h2 class="text-on-surface font-bold text-lg">
                                {item.name}
                                <span class="text-primary text-sm">(Level {level}/{item.limit})</span>
                            </h2>
                            
                            <p class="text-on-surface-variant text-sm">{item.description}</p>
                            
                            <div class="flex justify-between items-center">
                                <span class="text-on-surface font-medium">
                                    {#if isMaxLevel}
                                        Max Level
                                    {:else}
                                        {currentPrice} papers
                                    {/if}
                                </span>
                                
                                <Button 
                                    variant={canAfford(currentPrice) && !isMaxLevel ? "filled" : "outlined"}
                                    disabled={!canAfford(currentPrice) || isMaxLevel}
                                    click={() => purchaseItem(item.key, currentPrice, isMaxLevel)}
                                >
                                    {#if isMaxLevel}
                                        Maxed
                                    {:else if level > 0}
                                        Upgrade
                                    {:else}
                                        Buy
                                    {/if}
                                </Button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>


<style>
    :global(body) {
        overflow: hidden;
    }

    .neg-margin-top {
        margin-top: -110px;
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