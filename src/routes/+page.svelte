<script lang="ts">
	import { SplitButton, SliderTicks, Button } from "m3-svelte";
	import Task from "$lib/components/Task.svelte";
    import type { Task as TaskType } from "$lib/types";

    let sampleTask: TaskType = {
        id: "1",
        title: "Task 1",
        description: "Description 1",
        reward: 10,
        uploadedAt: new Date(),
        completed: false
    }
</script>

<div class="bg-secondary-container mt-10 mx-5 h-screen rounded-t-3xl">
    <div class="grid grid-cols-3 mx-4">
        <div class="big-split-button pt-4">
            <SplitButton click={() => {alert("hi")}} variant="elevated">
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" {...$$props}>
                        <path fill="currentColor" d="M4 21q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z" />
                    </svg>
                    Create Task
                    {#snippet menu()}
                        and more
                    {/snippet}
            </SplitButton> 
        </div>
        <div class="col-span-1 pt-4 ">
            <div class="flex flex-row items-center">
                <span class="text-on-secondary-fixed mr-2">
                    0
                </span>
                <div class="w-full slider-stuff">
                    <SliderTicks showValue min={0} max={4} step={1} value={2} disabled />
                </div>
                <span class="text-on-secondary-fixed ml-2">
                    4
                </span>
            </div>
            <div class="flex flex-row items-center justify-center">
                <span class="text-on-secondary-fixed mr-2 text-sm">
                    2 Tasks to Reward
                </span>
            </div>
        </div>
        <div class="big-normal-button pt-4 justify-self-end">
            <Button click={() => {alert("hi")}} variant="filled">
                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" {...$$props}>
                    <path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2" />
                </svg>
            </Button> 
        </div>
    </div>

    <div class="w-3/5 ml-4">
        <div class="col-span-1 grid grid-cols-2 gap-4">
            <Task task={sampleTask} />
            <Task task={sampleTask} />
            <Task task={sampleTask} />
            <Task task={sampleTask} />
            <Task task={sampleTask} />
        </div>
    </div>
</div>

<style>
    .big-split-button :global(button) {
        width: 10rem;
        height: 3.5rem;
        gap: 0;
    }

    .big-normal-button :global(button) {
        width: 3rem;
        height: 3.5rem;
    }

    .big-normal-button :global(button svg) {
        width: 1.6rem;
        height: 1.6rem;
    }

    .big-split-button :global(summary) {
        height: 3.5rem;
        gap: 0;
    }
    .big-split-button :global(button svg) {
        width: 1.6rem;
        height: 1.6rem;
    }

    .slider-stuff :global(div ::before) {
        background-color: rgb(var(--m3-scheme-primary)) !important;
    }
    .slider-stuff :global(div ::after) {
        background-color: rgb(var(--m3-scheme-primary-fixed-dim)) !important;
    }
</style>