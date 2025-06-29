// In the future, points will be detirmined more systemically, but for now they will be 1 per. This shouldn't impact the game in any way.

export interface Task {
    id: string;
    title: string;
    description: string;
    reward: number;
    uploadedAt: Date;
    completed: boolean;
}

export interface ListItem {
    description: string;
    checked: boolean;
}

export interface TaskList {
    id: string;
    title: string;
    tasks: ListItem[];
    uploadedAt: Date;
    reward: number;
    completed: boolean;
}