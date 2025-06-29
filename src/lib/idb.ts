// IRB wrapper wrapper by Cattn - Originally made for the bunker project & modified further here, adding types.
import { openDB, type IDBPDatabase } from 'idb';

export interface IDBStore {
	get: (key: string) => Promise<unknown>;
	set: (key: string, value: unknown) => Promise<unknown>;
	del: (key: string) => Promise<unknown>;
	clear: () => Promise<unknown>;
	keys: () => Promise<IDBValidKey[]>;
}

export class IDB {
	public static createKeyval(name: string) {
		return openDB(name, 1, {
			upgrade(db) {
				db.createObjectStore('keyval');
			}
		});
	}

	public static createDB(name: string) {
		return openDB(name, 1, {});
	}

	public static openDB(name: string) {
		return openDB(name);
	}

	public static addObjectStore(db: IDBPDatabase, storeName: string) {
		const version = db.version + 1;
		return openDB(db.name, version, {
			upgrade(upgradedDb) {
				upgradedDb.createObjectStore(storeName);
			}
		});
	}

	public static keyval = (store: Promise<IDBPDatabase>) => ({
		get: async (key: string) => {
			return (await store).get('keyval', key);
		},

		set: async (key: string, value: unknown) => {
			return (await store).put('keyval', value, key);
		},

		del: async (key: string) => {
			return (await store).delete('keyval', key);
		},

		clear: async () => {
			return (await store).clear('keyval');
		},

		keys: async () => {
			return (await store).getAllKeys('keyval');
		}
	});

	public static store = (store: Promise<IDBPDatabase>, object: string) => ({
		get: async (key: string) => {
			return (await store).get(object, key);
		},
		set: async (key: string, value: unknown) => {
			return (await store).put(object, value, key);
		},

		del: async (key: string) => {
			return (await store).delete(object, key);
		},

		clear: async () => {
			return (await store).clear(object);
		},

		keys: async () => {
			return (await store).getAllKeys(object);
		}
	});
}