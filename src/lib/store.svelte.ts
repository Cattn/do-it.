let gamePage = $state(false);
let taskPage = $state(false);

export const curPage = {
	get gamePage() { return gamePage; },
	set gamePage(value) { gamePage = value; },
	get taskPage() { return taskPage; },
	set taskPage(value) { taskPage = value; }
};