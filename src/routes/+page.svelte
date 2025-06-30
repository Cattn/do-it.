<script lang="ts">
	import { SplitButton, SliderTicks, Button, Menu, MenuItem } from "m3-svelte";
	import Task from "$lib/components/Task.svelte";
    import TaskList from "$lib/components/TaskList.svelte";
    import type { Task as TaskType, TaskList as TaskListType, ListItem as ListItemType } from "$lib/types";
    import { taskStore, taskListStore, gameStore } from "$lib/store.svelte";
    import { v4 as uuidv4 } from 'uuid';
    import { onMount } from "svelte";

    let showCreateTaskModal = $state(false);
    let showCreateListModal = $state(false);
    let storesReady = $state(false);

    let points = $state(0);

    let showFilterMenu = $state(false);
    let currentFilter = $state<'all' | 'active' | 'completed'>('all');
    let sortBy = $state<'date' | 'reward'>('date');
    let sortOrder = $state<'asc' | 'desc'>('desc');

    async function loadGameData() {
        points = await gameStore.getPoints();
    }

    onMount(() => {
        async function initializeData() {
            await waitForStores();
            await loadGameData();
        }
        
        initializeData();
        document.addEventListener('click', handleFilterMenuClickOutside);
        
        return () => {
            document.removeEventListener('click', handleFilterMenuClickOutside);
        };
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

    $effect(() => {
        if (points >= 4) {
            gameStore.setPoints(0);
            points = 0;
            gameStore.addTasks(1);
            sliderValue = 0;
        }
    });
    
    let newTask = $state<Partial<TaskType>>({
        title: "",
        description: "",
        reward: 1
    });
    
    let newTaskList = $state<Partial<TaskListType>>({
        title: "",
        tasks: [{ description: "", checked: false }],
        reward: 1
    });

    async function handleComplete(task: TaskType) {
        await taskStore.complete(task.id);
        await gameStore.addPoints(task.reward);
    }

    async function handleDelete(task: TaskType) {
        await taskStore.delete(task.id);
    }

    async function handleUpdate(task: TaskType) {
        await taskStore.update(task);
    }

    function openCreateTaskModal() {
        newTask = { title: "", description: "", reward: 1 };
        showCreateTaskModal = true;
    }

    function closeCreateTaskModal() {
        showCreateTaskModal = false;
    }

    async function createTask() {
        if (newTask.title && newTask.description) {
            const task: TaskType = {
                id: uuidv4(),
                title: newTask.title,
                description: newTask.description,
                reward: newTask.reward || 1,
                uploadedAt: new Date(),
                completed: false
            };
            await taskStore.create(task);
            closeCreateTaskModal();
        }
    }

    function openCreateListModal() {
        newTaskList = { 
            title: "", 
            tasks: [{ description: "", checked: false }], 
            reward: 1 
        };
        showCreateListModal = true;
    }

    function closeCreateListModal() {
        showCreateListModal = false;
    }

    async function createTaskList() {
        if (newTaskList.title && newTaskList.tasks && newTaskList.tasks.length > 0) {
            const taskListToCreate: TaskListType = {
                id: uuidv4(),
                title: newTaskList.title,
                tasks: newTaskList.tasks.map(task => ({ ...task })),
                reward: newTaskList.reward || 1,
                uploadedAt: new Date(),
                completed: false
            };
            await taskListStore.create(taskListToCreate);
            closeCreateListModal();
        }
    }

    function addNewTaskItem() {
        if (newTaskList.tasks) {
            newTaskList.tasks = [...newTaskList.tasks, { description: "", checked: false }];
        }
    }

    function removeTaskItem(index: number) {
        if (newTaskList.tasks) {
            newTaskList.tasks = newTaskList.tasks.filter((_, i) => i !== index);
        }
    }

    function handleOverlayClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            closeCreateTaskModal();
            closeCreateListModal();
        }
    }

    async function handleTaskListComplete(taskList: TaskListType) {
        await taskListStore.complete(taskList.id);
    }

    async function handleTaskListDelete(taskList: TaskListType) {
        await taskListStore.delete(taskList.id);
    }

    async function handleTaskListUpdate(taskList: TaskListType) {
        await taskListStore.update(taskList);
    }

    let sliderValue = $derived(points);
    let filteredActiveTasks = $derived(taskStore.activeTasks.filter(task => {
        if (currentFilter === 'completed') return false;
        if (currentFilter === 'active') return !task.completed;
        return currentFilter === 'all' || !task.completed;
    }).sort((a, b) => {
        if (sortBy === 'reward') {
            return sortOrder === 'asc' ? a.reward - b.reward : b.reward - a.reward;
        }
        return sortOrder === 'asc' 
            ? new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
            : new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    }));

    let filteredCompletedTasks = $derived(taskStore.completedTasks.filter(task => {
        if (currentFilter === 'active') return false;
        if (currentFilter === 'completed') return task.completed;
        return currentFilter === 'all' || task.completed;
    }).sort((a, b) => {
        if (sortBy === 'reward') {
            return sortOrder === 'asc' ? a.reward - b.reward : b.reward - a.reward;
        }
        return sortOrder === 'asc' 
            ? new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
            : new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    }));

    let filteredActiveTaskLists = $derived(taskListStore.activeTaskLists.filter(taskList => {
        if (currentFilter === 'completed') return false;
        if (currentFilter === 'active') return !taskList.completed;
        return currentFilter === 'all' || !taskList.completed;
    }).sort((a, b) => {
        if (sortBy === 'reward') {
            return sortOrder === 'asc' ? a.reward - b.reward : b.reward - a.reward;
        }
        return sortOrder === 'asc' 
            ? new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
            : new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    }));

    let filteredCompletedTaskLists = $derived(taskListStore.completedTaskLists.filter(taskList => {
        if (currentFilter === 'active') return false;
        if (currentFilter === 'completed') return taskList.completed;
        return currentFilter === 'all' || taskList.completed;
    }).sort((a, b) => {
        if (sortBy === 'reward') {
            return sortOrder === 'asc' ? a.reward - b.reward : b.reward - a.reward;
        }
        return sortOrder === 'asc' 
            ? new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
            : new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    }));

    function toggleFilterMenu() {
        showFilterMenu = !showFilterMenu;
    }

    function handleFilterMenuClickOutside(event: MouseEvent) {
        if (!event.target || !(event.target as Element).closest('.big-normal-button')) {
            showFilterMenu = false;
        }
    }
</script>

<div class="bg-secondary-container mt-10 mx-5 pb-5 rounded-t-3xl">
    <div class="grid grid-cols-3 mx-4">
        <div class="big-split-button pt-4">
            <SplitButton click={openCreateTaskModal} variant="elevated">
                    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M4 21q-.425 0-.712-.288T3 20v-2.425q0-.4.15-.763t.425-.637L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763t-.437.662l-12.6 12.6q-.275.275-.638.425t-.762.15zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z" />
                    </svg>
                    Create Task
                    {#snippet menu()}
                        <Menu>
                            <MenuItem click={openCreateListModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M8 9q-.425 0-.712-.288T7 8t.288-.712T8 7h12q.425 0 .713.288T21 8t-.288.713T20 9zm0 4q-.425 0-.712-.288T7 12t.288-.712T8 11h12q.425 0 .713.288T21 12t-.288.713T20 13zm0 4q-.425 0-.712-.288T7 16t.288-.712T8 15h12q.425 0 .713.288T21 16t-.288.713T20 17zM4 9q-.425 0-.712-.288T3 8t.288-.712T4 7t.713.288T5 8t-.288.713T4 9m0 4q-.425 0-.712-.288T3 12t.288-.712T4 11t.713.288T5 12t-.288.713T4 13m0 4q-.425 0-.712-.288T3 16t.288-.712T4 15t.713.288T5 16t-.288.713T4 17" />
                                </svg>
                                List
                            </MenuItem>
                        </Menu>
                    {/snippet}
            </SplitButton> 
        </div>
        <div class="col-span-1 pt-4 ">
            <div class="flex flex-row items-center">  
                <span class="text-on-secondary-fixed mr-2">
                    0
                </span>
                <div class="w-full slider-stuff">
                    {#if storesReady}
                        {#key points}
                            <SliderTicks showValue min={0} max={4} step={1} value={sliderValue} disabled />
                        {/key}
                    {/if}
                </div>
                <span class="text-on-secondary-fixed ml-2">
                    4
                </span>
            </div>
            <div class="flex flex-row items-center justify-center">
                <span class="text-on-secondary-fixed mr-2 text-sm">
                    {4 - points} Points to Reward
                </span>
            </div>
        </div>
        <div class="big-normal-button pt-4 justify-self-end relative">
            <Button click={toggleFilterMenu} variant="filled">
                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
                </svg>
            </Button>
            {#if showFilterMenu}
                <div class="filter-menu">
                    <div class="filter-section">
                        <h3 class="filter-title">Filter</h3>
                        <div class="filter-options">
                            <Button 
                                variant={currentFilter === 'all' ? 'filled' : 'text'}
                                click={() => { currentFilter = 'all'; showFilterMenu = false; }}
                            >
                                All Tasks
                            </Button>
                            <Button 
                                variant={currentFilter === 'active' ? 'filled' : 'text'}
                                click={() => { currentFilter = 'active'; showFilterMenu = false; }}
                            >
                                Active Only
                            </Button>
                            <Button 
                                variant={currentFilter === 'completed' ? 'filled' : 'text'}
                                click={() => { currentFilter = 'completed'; showFilterMenu = false; }}
                            >
                                Completed Only
                            </Button>
                        </div>
                    </div>
                    <div class="filter-section">
                        <h3 class="filter-title">Sort By</h3>
                        <div class="filter-options">
                            <Button 
                                variant={sortBy === 'date' ? 'filled' : 'text'}
                                click={() => { sortBy = 'date'; showFilterMenu = false; }}
                            >
                                Date
                            </Button>
                            <Button 
                                variant={sortBy === 'reward' ? 'filled' : 'text'}
                                click={() => { sortBy = 'reward'; showFilterMenu = false; }}
                            >
                                Reward
                            </Button>
                        </div>
                    </div>
                    <div class="filter-section">
                        <h3 class="filter-title">Order</h3>
                        <div class="filter-options">
                            <Button 
                                variant={sortOrder === 'desc' ? 'filled' : 'text'}
                                click={() => { sortOrder = 'desc'; showFilterMenu = false; }}
                            >
                                Descending
                            </Button>
                            <Button 
                                variant={sortOrder === 'asc' ? 'filled' : 'text'}
                                click={() => { sortOrder = 'asc'; showFilterMenu = false; }}
                            >
                                Ascending
                            </Button>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
    <div class="flex flex-row">
        <div class="w-3/5 ml-4">
            <div class="col-span-1 grid grid-cols-2 gap-4"> 
                {#each filteredActiveTasks as task}
                    <Task task={task} onComplete={handleComplete} onDelete={handleDelete} onUpdate={handleUpdate} />
                {/each}
            </div>
        </div>

        <div class="w-2/5 ml-4 flex flex-row">
            <div class="w-px h-full bg-primary ml-6"></div>
            <div class="grid grid-cols-2 gap-y-4 gap-x-6 ml-6">
                {#each filteredActiveTaskLists as taskListItem}
                    <TaskList 
                        taskList={taskListItem} 
                        onComplete={handleTaskListComplete}
                        onDelete={handleTaskListDelete}
                        onUpdate={handleTaskListUpdate}
                    />
                {/each}
            </div>
        </div>
    </div>
    <hr class="my-4 ml-4" />
    <div class="flex flex-row">
        <div class="w-3/5 ml-4">
            <div class="col-span-1 grid grid-cols-2 gap-4 mt-4">
                {#each filteredCompletedTasks as task}
                    <Task task={task} onComplete={handleComplete} onDelete={handleDelete} onUpdate={handleUpdate} />
                {/each}
            </div>
        </div>
        <div class="w-2/5 ml-4 flex flex-row">
            <div class="w-px h-full bg-primary ml-6"></div>
            <div class="grid grid-cols-2 gap-y-4 gap-x-6 ml-6 mt-4">
                {#each filteredCompletedTaskLists as taskListItem}
                    <TaskList 
                        taskList={taskListItem} 
                        onComplete={handleTaskListComplete}
                        onDelete={handleTaskListDelete}
                        onUpdate={handleTaskListUpdate}
                    />
                {/each}
            </div>
        </div>
    </div>
</div>

{#if showCreateTaskModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={handleOverlayClick}>
        <div class="modal-container">
            <div class="modal-header">
                <h2 class="modal-title">Create New Task</h2>
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button class="close-button" onclick={closeCreateTaskModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.88a.996.996 0 1 0 1.41-1.41L13.41 12l4.88-4.89c.38-.38.38-1.02 0-1.4z"/>
                    </svg>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="form-group">
                    <label for="task-title" class="form-label">Title</label>
                    <input 
                        id="task-title"
                        type="text" 
                        bind:value={newTask.title}
                        class="form-input"
                        placeholder="Enter task title"
                    />
                </div>
                
                <div class="form-group">
                    <label for="task-description" class="form-label">Description</label>
                    <textarea 
                        id="task-description"
                        bind:value={newTask.description}
                        class="form-textarea"
                        placeholder="Enter task description"
                        rows="4"
                    ></textarea>
                </div>
            </div>
            
            <div class="modal-footer">
                <Button variant="outlined" click={closeCreateTaskModal}>Cancel</Button>
                <Button variant="filled" click={createTask}>Create Task</Button>
            </div>
        </div>
    </div>
{/if}

{#if showCreateListModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={handleOverlayClick}>
        <div class="modal-container">
            <div class="modal-header">
                <h2 class="modal-title">Create New Task List</h2>
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button class="close-button" onclick={closeCreateListModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.88a.996.996 0 1 0 1.41-1.41L13.41 12l4.88-4.89c.38-.38.38-1.02 0-1.4z"/>
                    </svg>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="form-group">
                    <label for="list-title" class="form-label">Title</label>
                    <input 
                        id="list-title"
                        type="text" 
                        bind:value={newTaskList.title}
                        class="form-input"
                        placeholder="Enter task list title"
                    />
                </div>
                
                <div class="form-group">
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label class="form-label">Tasks</label>
                    <div class="task-list-editor">
                        {#each newTaskList.tasks || [] as taskItem, index}
                            <div class="task-editor-item">
                                <input 
                                    type="text" 
                                    bind:value={taskItem.description}
                                    class="form-input flex-grow"
                                    placeholder="Enter task description"
                                />
                                {#if (newTaskList.tasks?.length || 0) > 1}
                                    <!-- svelte-ignore a11y_consider_explicit_label -->
                                    <button class="remove-task-button" onclick={() => removeTaskItem(index)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.88a.996.996 0 1 0 1.41-1.41L13.41 12l4.88-4.89c.38-.38.38-1.02 0-1.4z"/>
                                        </svg>
                                    </button>
                                {/if}
                            </div>
                        {/each}
                        <Button variant="outlined" click={addNewTaskItem}>Add Task</Button>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <Button variant="outlined" click={closeCreateListModal}>Cancel</Button>
                <Button variant="filled" click={createTaskList}>Create List</Button>
            </div>
        </div>
    </div>
{/if}

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

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(var(--m3-scheme-scrim) / 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(2px);
    }

    .modal-container {
        background: rgb(var(--m3-scheme-surface-container));
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        animation: modalEnter 0.2s ease-out;
    }

    @keyframes modalEnter {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px 16px;
        border-bottom: 1px solid rgb(var(--m3-scheme-outline-variant));
    }

    .modal-title {
        font-size: 20px;
        font-weight: 600;
        font-family: "Roboto Flex", sans-serif;
        margin: 0;
        color: rgb(var(--m3-scheme-on-surface));
    }

    .close-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 6px;
        color: rgb(var(--m3-scheme-on-surface-variant));
        transition: all 0.2s;
    }

    .close-button:hover {
        background-color: rgb(var(--m3-scheme-surface-container-high));
        color: rgb(var(--m3-scheme-on-surface));
    }

    .modal-body {
        padding: 20px 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .form-label {
        font-size: 14px;
        font-weight: 500;
        font-family: "Roboto Flex", sans-serif;
        color: rgb(var(--m3-scheme-on-surface));
    }

    .form-input,
    .form-textarea {
        padding: 12px 16px;
        border: 1px solid rgb(var(--m3-scheme-outline));
        border-radius: 8px;
        font-size: 14px;
        font-family: "Roboto Flex", sans-serif;
        transition: border-color 0.2s, box-shadow 0.2s;
        background-color: rgb(var(--m3-scheme-surface));
        color: rgb(var(--m3-scheme-on-surface));
    }

    .form-input:focus,
    .form-textarea:focus {
        outline: none;
        border-color: rgb(var(--m3-scheme-primary));
    }

    .filter-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: rgb(var(--m3-scheme-surface-container));
        border-radius: var(--m3-util-rounding-large);
        box-shadow: var(--m3-util-elevation-2);
        z-index: 1000;
        min-width: 200px;
        margin-top: 8px;
        padding: 16px;
        animation: menuEnter 0.2s ease-out;
    }

    @keyframes menuEnter {
        from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .filter-section {
        margin-bottom: 20px;
    }

    .filter-section:last-child {
        margin-bottom: 0;
    }

    .filter-title {
        font-size: 11px;
        font-weight: 500;
        color: rgb(var(--m3-scheme-on-surface-variant));
        margin: 0 0 12px 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-family: "Roboto Flex", sans-serif;
    }

    .filter-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .filter-options :global(button) {
        width: 100%;
        justify-content: flex-start;
    }

    .form-input:focus,
    .form-textarea:focus {
        box-shadow: 0 0 0 3px rgb(var(--m3-scheme-primary) / 0.1);
    }

    .form-textarea {
        resize: vertical;
        min-height: 100px;
    }

    .task-list-editor {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .task-editor-item {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .remove-task-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        color: rgb(var(--m3-scheme-error));
        transition: all 0.2s;
    }

    .remove-task-button:hover {
        background-color: rgb(var(--m3-scheme-error-container));
    }

    .modal-footer {
        padding: 16px 24px 24px;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        border-top: 1px solid rgb(var(--m3-scheme-outline-variant));
    }
</style>