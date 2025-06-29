<script lang="ts">
    import type { TaskList } from "$lib/types";
    import { Button, Checkbox } from "m3-svelte";

    
    let { taskList, onUpdate, onDelete, onComplete }: { 
        taskList: TaskList;
        onUpdate?: (taskList: TaskList) => void;
        onDelete?: (taskList: TaskList) => void;
        onComplete?: (taskList: TaskList) => void;
    } = $props();

    let showModal = $state(false);
    let editedTaskList = $state({ ...taskList });

    function openModal() {
        editedTaskList = { ...taskList, tasks: taskList.tasks.map(t => ({ ...t })) };
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    function saveChanges() {
        onUpdate?.(editedTaskList);
        closeModal();
    }

    function handleOverlayClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    function updateTaskItem(index: number) {
        onUpdate?.(taskList);
    }

    function addNewTaskItem() {
        editedTaskList.tasks = [...editedTaskList.tasks, { description: "", checked: false }];
    }

    function removeTaskItem(index: number) {
        editedTaskList.tasks = editedTaskList.tasks.filter((_, i) => i !== index);
    }
</script> 

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flex flex-col justify-between bg-tertiary-container rounded-lg drop-shadow-lg p-4 w-[280px] min-h-[400px] max-w-[300px]" onclick={openModal}>
    <div class="flex flex-row items-center mb-5"> 
        <div class="flex flex-col">
            <h1 class="text-on-secondary-fixed title-text">{taskList.title}</h1> 
        </div>
    </div>

    <div class="task-items-container">
        {#each taskList.tasks as taskItem, index}
            <div class="task-item">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <label class="task-item-label" onclick={(e) => e.stopPropagation()}>
                    <Checkbox>
                        <input 
                            type="checkbox" 
                            bind:checked={taskItem.checked} 
                            onchange={() => updateTaskItem(index)}
                        />
                    </Checkbox>
                    <span class="task-item-text" class:completed={taskItem.checked}>{taskItem.description}</span>
                </label>
            </div>
        {/each}
    </div>

    <div class="flex flex-row justify-between items-end">
        <div class="flex flex-row items-center">
            <h1 class="text-on-secondary-fixed date-text">{taskList.uploadedAt.toLocaleDateString()}</h1>
            <span class="text-on-secondary-fixed date-text mx-1">·</span>
            <p class="text-on-secondary-fixed date-text">{taskList.reward} point{taskList.reward > 1 ? "s" : ""}</p>
        </div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="flex flex-row items-center gap-2" onclick={(e) => e.stopPropagation()}>
            <Button variant="outlined" iconType="left" click={() => onDelete?.(taskList)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m4.3 14.3a.996.996 0 0 1-1.41 0L12 13.41L9.11 16.3a.996.996 0 1 1-1.41-1.41L10.59 12L7.7 9.11A.996.996 0 1 1 9.11 7.7L12 10.59l2.89-2.89a.996.996 0 1 1 1.41 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41" />
                </svg>
            </Button>
            {#if !taskList.completed}
            <Button variant="filled" iconType="left" click={() => onComplete?.(taskList)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41z" />
                </svg>
            </Button>
            {/if}
        </div>
    </div>
</div>

<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if showModal}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-overlay" onclick={handleOverlayClick}>
        <div class="modal-container">
            <div class="modal-header">
                <h2 class="modal-title">Edit Task List</h2>
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button class="close-button" onclick={closeModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.88a.996.996 0 1 0 1.41-1.41L13.41 12l4.88-4.89c.38-.38.38-1.02 0-1.4z"/>
                    </svg>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="form-group">
                    <label for="title" class="form-label">Title</label>
                    <input 
                        id="title"
                        type="text" 
                        bind:value={editedTaskList.title}
                        class="form-input"
                        placeholder="Enter task list title"
                    />
                </div>
                
                <div class="form-group">
                    <!-- svelte-ignore a11y_label_has_associated_control -->
                    <label class="form-label">Tasks</label>
                    <div class="task-list-editor">
                        {#each editedTaskList.tasks as taskItem, index}
                            <div class="task-editor-item">
                                <input 
                                    type="text" 
                                    bind:value={taskItem.description}
                                    class="form-input flex-grow"
                                    placeholder="Enter task description"
                                />
                                <!-- svelte-ignore a11y_consider_explicit_label -->
                                <button class="remove-task-button" onclick={() => removeTaskItem(index)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.88a.996.996 0 1 0 1.41-1.41L13.41 12l4.88-4.89c.38-.38.38-1.02 0-1.4z"/>
                                    </svg>
                                </button>
                            </div>
                        {/each}
                        <Button variant="outlined" click={addNewTaskItem}>Add Task</Button>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <Button variant="outlined" click={closeModal}>Cancel</Button>
                <Button variant="filled" click={saveChanges}>Save Changes</Button>
            </div>
        </div>
    </div>
{/if}

<style>
    .title-text {
        font-size: 22px;
        font-weight: bold;
        font-family: "Roboto Flex", sans-serif;
    }

    .date-text {
        font-size: 12px;
        font-weight: 300;
        font-family: "Roboto Flex", sans-serif;
    }



    .task-items-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
        flex-grow: 1;
    }

    .task-item {
        display: flex;
        align-items: center;
        min-height: 32px;
        padding: 4px 0;
    }

    .task-item-label {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        width: 100%;
    }

    .task-item-text {
        font-size: 14px;
        font-family: "Roboto Flex", sans-serif;
        color: rgb(var(--m3-scheme-on-surface));
        transition: all 0.2s ease;
    }

    .task-item-text.completed {
        text-decoration: line-through;
        opacity: 0.6;
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

    .form-input {
        padding: 12px 16px;
        border: 1px solid rgb(var(--m3-scheme-outline));
        border-radius: 8px;
        font-size: 14px;
        font-family: "Roboto Flex", sans-serif;
        transition: border-color 0.2s, box-shadow 0.2s;
        background-color: rgb(var(--m3-scheme-surface));
        color: rgb(var(--m3-scheme-on-surface));
    }

    .form-input:focus {
        outline: none;
        border-color: rgb(var(--m3-scheme-primary));
        box-shadow: 0 0 0 3px rgb(var(--m3-scheme-primary) / 0.1);
    }

    .modal-footer {
        padding: 16px 24px 24px;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        border-top: 1px solid rgb(var(--m3-scheme-outline-variant));
    }
</style>