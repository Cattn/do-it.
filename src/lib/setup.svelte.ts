import { IDB } from "./idb";

export const setup = async () => {
    const taskDB = IDB.createDB('task-manager');
    const dbWithStores = await IDB.addObjectStore(await taskDB, 'tasks');
    const finalDB = await IDB.addObjectStore(dbWithStores, 'task-lists');
    const tasksStore = IDB.store(Promise.resolve(finalDB), 'tasks');
    const taskListsStore = IDB.store(Promise.resolve(finalDB), 'task-lists');

    const gameDB = IDB.createDB('game-manager');
    const dbWithStores1 = await IDB.addObjectStore(await gameDB, 'points');
    const pointsStore = IDB.store(Promise.resolve(dbWithStores1), 'points');

    return {
        tasksStore,
        taskListsStore,
        pointsStore
    };
}