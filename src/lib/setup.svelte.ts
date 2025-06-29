import { openDB } from 'idb';
import { IDB, type IDBStore } from "./idb";
import type { Task, TaskList } from './types';

async function loadTasksFromIDB(tasksStore: IDBStore): Promise<Task[]> {
    try {
        
        const keys = await tasksStore.keys();
        const loadedTasks: Task[] = [];
        
        for (const key of keys) {
            if (typeof key === 'string') {
                const task = await tasksStore.get(key) as Task | undefined;
                if (task && task.id && task.title) {
                    const taskWithDate = {
                        ...task,
                        uploadedAt: new Date(task.uploadedAt)
                    };
                    loadedTasks.push(taskWithDate);
                }
            }
        }
        
        loadedTasks.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
        return loadedTasks;
    } catch (error) {
        console.error('Error loading tasks from IDB:', error);
        return [];
    }
}

async function loadTaskListsFromIDB(taskListsStore: IDBStore): Promise<TaskList[]> {
    try {
        
        const keys = await taskListsStore.keys();
        const loadedTaskLists: TaskList[] = [];
        
        for (const key of keys) {
            if (typeof key === 'string') {
                const taskList = await taskListsStore.get(key) as TaskList | undefined;
                if (taskList && taskList.id && taskList.title) {
                    const taskListWithDate = {
                        ...taskList,
                        uploadedAt: new Date(taskList.uploadedAt)
                    };
                    loadedTaskLists.push(taskListWithDate);
                }
            }
        }

        loadedTaskLists.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
        return loadedTaskLists;
    } catch (error) {
        console.error('Error loading task lists from IDB:', error);
        return [];
    }
}

export const setup = async () => {
    try {
        const taskDB = await openDB('task-manager', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('tasks')) {
                    db.createObjectStore('tasks');
                }
                if (!db.objectStoreNames.contains('task-lists')) {
                    db.createObjectStore('task-lists');
                }
            }
        });
        
        const tasksStore = IDB.store(Promise.resolve(taskDB), 'tasks');
        const taskListsStore = IDB.store(Promise.resolve(taskDB), 'task-lists');

        const gameDB = await openDB('game-manager', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('points')) {
                    db.createObjectStore('points');
                }
            }
        });
        const pointsStore = IDB.store(Promise.resolve(gameDB), 'points');

        const initialTasks = await loadTasksFromIDB(tasksStore);
        const initialTaskLists = await loadTaskListsFromIDB(taskListsStore);

        return {
            tasksStore,
            taskListsStore,
            pointsStore,
            initialTasks,
            initialTaskLists
        };
    } catch (error) {
        console.error('Setup failed:', error);
        throw error;
    }
}