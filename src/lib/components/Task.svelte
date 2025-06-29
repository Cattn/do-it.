<script lang="ts">
    import type { Task } from "$lib/types";
    import { Button } from "m3-svelte";

    
    let { task,
        onComplete,
        onDelete 
    }: { 
        task: Task;
        onComplete?: (task: Task) => void;
        onDelete?: (task: Task) => void;
    } = $props();
</script> 

<div class="flex flex-col justify-between bg-tertiary-container rounded-md drop-shadow-lg p-4 w-full">
    <div class="flex flex-row items-center mb-5"> 
        <div class="flex flex-col">
            <h1 class="text-on-secondary-fixed title-text">{task.title}</h1>
            <p class="text-on-secondary-fixed description-text">{task.description}</p>
        </div>
    </div>
    <div class="flex flex-row justify-between items-end">
        <div class="flex flex-row items-center">
            <h1 class="text-on-secondary-fixed date-text">{task.uploadedAt.toLocaleDateString()}</h1>
            <span class="text-on-secondary-fixed date-text mx-1">·</span>
            <p class="text-on-secondary-fixed date-text">{task.reward} points</p>
        </div>
        <div class="flex flex-row items-center gap-2">
            <Button variant="outlined" iconType="left" click={() => onDelete?.(task)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41" />
                </svg>
            </Button>
            <Button variant="filled" iconType="left" click={() => onComplete?.(task)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41z" />
                </svg>
            </Button>
        </div>
    </div>
</div>

<style>
    .title-text {
        font-size: 22px;
        font-weight: bold;
        font-family: "Roboto Flex", sans-serif;
    }

    .description-text {
        font-size: 14px;
        font-weight: regular;
        font-family: "Roboto Flex", sans-serif;
    }

    .date-text {
        font-size: 12px;
        font-weight: 300;
        font-family: "Roboto Flex", sans-serif;
    }
</style>