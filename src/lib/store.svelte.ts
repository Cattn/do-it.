import type { Task, TaskList } from './types';
import type { IDBStore } from './idb';

let gamePage = $state(false);
let taskPage = $state(false);

export const curPage = {
	get gamePage() { return gamePage; },
	set gamePage(value) { gamePage = value; },
	get taskPage() { return taskPage; },
	set taskPage(value) { taskPage = value; }
};

const tasks = $state<Task[]>([]);
const taskLists = $state<TaskList[]>([]);
let tasksStore: IDBStore | null = null;
let taskListsStore: IDBStore | null = null;
let papersStore: IDBStore | null = null;
let tasksGameStore: IDBStore | null = null;
let multipliersStore: IDBStore | null = null;
let shopStore: IDBStore | null = null;

export function initializeStores(
	tasksStoreRef: IDBStore, 
	taskListsStoreRef: IDBStore,
	papersStoreRef: IDBStore,
	tasksGameStoreRef: IDBStore,
	multipliersStoreRef: IDBStore,
	shopStoreRef: IDBStore,
	initialTasks: Task[],
	initialTaskLists: TaskList[]
) {
	tasksStore = tasksStoreRef;
	taskListsStore = taskListsStoreRef;
	papersStore = papersStoreRef;
	tasksGameStore = tasksGameStoreRef;
	multipliersStore = multipliersStoreRef;
	shopStore = shopStoreRef;

	tasks.splice(0, tasks.length, ...initialTasks);
	taskLists.splice(0, taskLists.length, ...initialTaskLists);
}

export const taskStore = {
	get tasks() { return tasks; },
	get activeTasks() { return tasks.filter(task => !task.completed); },
	get completedTasks() { return tasks.filter(task => task.completed); },
	
	async create(task: Task) {
		if (!tasksStore) {
			throw new Error('Tasks store not initialized');
		}
		try {
			await tasksStore.set(task.id, task);
			tasks.push(task);
		} catch (error) {
			console.error('Error creating task:', error);
			throw error;
		}
	},
	
	async update(updatedTask: Task) {
		if (!tasksStore) {
			throw new Error('Tasks store not initialized');
		}
		try {
			await tasksStore.set(updatedTask.id, updatedTask);
			const index = tasks.findIndex(task => task.id === updatedTask.id);
			if (index !== -1) {
				tasks[index] = updatedTask;
			}
		} catch (error) {
			console.error('Error updating task:', error);
			throw error;
		}
	},
	
	async complete(taskId: string) {
		if (!tasksStore) {
			throw new Error('Tasks store not initialized');
		}
		try {
			const taskIndex = tasks.findIndex(t => t.id === taskId);
			if (taskIndex !== -1) {
				const completedTask = { ...tasks[taskIndex], completed: true };
				await tasksStore.set(taskId, completedTask);
				tasks[taskIndex] = completedTask;
			}
		} catch (error) {
			console.error('Error completing task:', error);
			throw error;
		}
	},
	
	async delete(taskId: string) {
		if (!tasksStore) {
			throw new Error('Tasks store not initialized');
		}
		try {
			await tasksStore.del(taskId);
			const index = tasks.findIndex(task => task.id === taskId);
			if (index !== -1) {
				tasks.splice(index, 1);
			}
		} catch (error) {
			console.error('Error deleting task:', error);
			throw error;
		}
	},
	
	async clearCompleted() {
		if (!tasksStore) {
			throw new Error('Tasks store not initialized');
		}
		try {
			const completedTasks = tasks.filter(task => task.completed);
			for (const task of completedTasks) {
				await tasksStore.del(task.id);
			}
			for (let i = tasks.length - 1; i >= 0; i--) {
				if (tasks[i].completed) {
					tasks.splice(i, 1);
				}
			}
		} catch (error) {
			console.error('Error clearing completed tasks:', error);
			throw error;
		}
	}
};

export const taskListStore = {
	get taskLists() { return taskLists; },
	get activeTaskLists() { return taskLists.filter(taskList => !taskList.completed); },
	get completedTaskLists() { return taskLists.filter(taskList => taskList.completed); },
	
	async create(taskList: TaskList) {
		if (!taskListsStore) {
			throw new Error('Task lists store not initialized');
		}
		try {
			const cleanTaskList: TaskList = {
				id: taskList.id,
				title: taskList.title,
				tasks: taskList.tasks.map(task => ({
					description: task.description,
					checked: task.checked
				})),
				uploadedAt: taskList.uploadedAt,
				reward: taskList.reward,
				completed: taskList.completed
			};
			await taskListsStore.set(taskList.id, cleanTaskList);
			taskLists.push(cleanTaskList);
		} catch (error) {
			console.error('Error creating task list:', error);
			throw error;
		}
	},
	
	async update(updatedTaskList: TaskList) {
		if (!taskListsStore) {
			throw new Error('Task lists store not initialized');
		}
		try {
			const cleanTaskList: TaskList = {
				id: updatedTaskList.id,
				title: updatedTaskList.title,
				tasks: updatedTaskList.tasks.map(task => ({
					description: task.description,
					checked: task.checked
				})),
				uploadedAt: updatedTaskList.uploadedAt,
				reward: updatedTaskList.reward,
				completed: updatedTaskList.completed
			};
			await taskListsStore.set(updatedTaskList.id, cleanTaskList);
			const index = taskLists.findIndex(taskList => taskList.id === updatedTaskList.id);
			if (index !== -1) {
				taskLists[index] = cleanTaskList;
			}
		} catch (error) {
			console.error('Error updating task list:', error);
			throw error;
		}
	},
	
	async complete(taskListId: string) {
		if (!taskListsStore) {
			throw new Error('Task lists store not initialized');
		}
		try {
			const taskListIndex = taskLists.findIndex(tl => tl.id === taskListId);
			if (taskListIndex !== -1) {
				const originalTaskList = taskLists[taskListIndex];
				const completedTaskList: TaskList = {
					id: originalTaskList.id,
					title: originalTaskList.title,
					tasks: originalTaskList.tasks.map(task => ({
						description: task.description,
						checked: task.checked
					})),
					uploadedAt: originalTaskList.uploadedAt,
					reward: originalTaskList.reward,
					completed: true
				};
				await taskListsStore.set(taskListId, completedTaskList);
				taskLists[taskListIndex] = completedTaskList;
			}
		} catch (error) {
			console.error('Error completing task list:', error);
			throw error;
		}
	},
	
	async delete(taskListId: string) {
		if (!taskListsStore) {
			throw new Error('Task lists store not initialized');
		}
		try {
			await taskListsStore.del(taskListId);
			const index = taskLists.findIndex(taskList => taskList.id === taskListId);
			if (index !== -1) {
				taskLists.splice(index, 1);
			}
		} catch (error) {
			console.error('Error deleting task list:', error);
			throw error;
		}
	},
	
	async clearCompleted() {
		if (!taskListsStore) {
			throw new Error('Task lists store not initialized');
		}
		try {
			const completedTaskLists = taskLists.filter(taskList => taskList.completed);
			for (const taskList of completedTaskLists) {
				await taskListsStore.del(taskList.id);
			}
			for (let i = taskLists.length - 1; i >= 0; i--) {
				if (taskLists[i].completed) {
					taskLists.splice(i, 1);
				}
			}
		} catch (error) {
			console.error('Error clearing completed task lists:', error);
			throw error;
		}
	}
};

export const gameStore = {
	async getPapers() {
		if (!papersStore) throw new Error('Papers store not initialized');
		return (await papersStore.get('count')) as number || 0;
	},

	async setPapers(amount: number) {
		if (!papersStore) throw new Error('Papers store not initialized');
		await papersStore.set('count', amount);
	},

	async addPapers(amount: number) {
		const current = await this.getPapers();
		await this.setPapers(current + amount);
	},

	async getTasks() {
		if (!tasksGameStore) throw new Error('Tasks store not initialized');
		return (await tasksGameStore.get('count')) as number || 0;
	},

	async setTasks(amount: number) {
		if (!tasksGameStore) throw new Error('Tasks store not initialized');
		await tasksGameStore.set('count', amount);
	},

	async addTasks(amount: number) {
		const current = await this.getTasks();
		await this.setTasks(current + amount);
	},

	async subtractTasks(amount: number) {
		const current = await this.getTasks();
		await this.setTasks(Math.max(0, current - amount));
	},

	async getMultiplier(key: string) {
		if (!multipliersStore) throw new Error('Multipliers store not initialized');
		return (await multipliersStore.get(key)) as number || 1;
	},

	async setMultiplier(key: string, value: number) {
		if (!multipliersStore) throw new Error('Multipliers store not initialized');
		await multipliersStore.set(key, value);
	},

	async getShopItem(key: string) {
		if (!shopStore) throw new Error('Shop store not initialized');
		return (await shopStore.get(key)) as boolean || false;
	},

	async purchaseShopItem(key: string) {
		if (!shopStore) throw new Error('Shop store not initialized');
		await shopStore.set(key, true);
	},

	async getUpgradeLevel(key: string) {
		if (!shopStore) throw new Error('Shop store not initialized');
		return (await shopStore.get(key)) as number || 0;
	},

	async purchaseUpgrade(key: string) {
		if (!shopStore) throw new Error('Shop store not initialized');
		const currentLevel = await this.getUpgradeLevel(key);
		await shopStore.set(key, currentLevel + 1);
	}
};

export const combinedStore = {
	get allActiveTasks() { 
		return {
			tasks: taskStore.activeTasks,
			taskLists: taskListStore.activeTaskLists
		}; 
	},
	
	get allCompletedTasks() { 
		return {
			tasks: taskStore.completedTasks,
			taskLists: taskListStore.completedTaskLists
		}; 
	},
	
	get totalActiveCount() {
		return taskStore.activeTasks.length + taskListStore.activeTaskLists.length;
	},
	
	get totalCompletedCount() {
		return taskStore.completedTasks.length + taskListStore.completedTaskLists.length;
	},
	
	async clearAllCompleted() {
		await Promise.all([
			taskStore.clearCompleted(),
			taskListStore.clearCompleted()
		]);
	}
};