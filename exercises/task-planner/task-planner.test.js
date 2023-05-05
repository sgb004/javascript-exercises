import { createTaskPlanner } from './task-planner.js';

const planner = createTaskPlanner();
const task1 = { id: 1, name: 'Comprar leche', priority: 3, tags: ['shopping', 'home'] };
const task2 = { id: 2, name: 'Llamar a Juan', priority: '1', tags: ['personal'] };

test('Should add a new task with completed property', () => {
	planner.addTask({ ...task1 });
	expect(planner.getTasks()).toStrictEqual([{ ...task1, completed: false }]);
});

test('Should remove a task with id', () => {
	planner.removeTask(task1.id);
	expect(planner.getTasks()).toStrictEqual([]);
});

test('Should remove a task with name', () => {
	planner.addTask({ ...task2 });
	planner.removeTask(task2.name);
	expect(planner.getTasks()).toStrictEqual([]);
});

test('Should mark as a complete one task with id', () => {
	planner.addTask({ ...task1 });
	planner.markTaskAsCompleted(1);
	expect(planner.getTasks()).toStrictEqual([{ ...task1, completed: true }]);
});

test('Should mark as a complete one task with name', () => {
	planner.addTask({ ...task2 });
	planner.markTaskAsCompleted(task2.name);
	expect(planner.getTasks()).toStrictEqual([
		{ ...task1, completed: true },
		{ ...task2, priority: 1, completed: true },
	]);
});

test('Should filter by tag', () => {
	expect(planner.filterTasksByTag('personal')).toStrictEqual([
		{ ...task2, priority: 1, completed: true },
	]);
});

test('Should return tasks ordered by priority', () => {
	expect(planner.getSortedTasksByPriority()).toStrictEqual([
		{ ...task2, priority: 1, completed: true },
		{ ...task1, completed: true },
	]);
});

test('Should not modify the original array', () => {
	const tasks = planner.getCompletedTasks();
	expect(tasks[0].completed).not.toBe(task1.completed);
	expect(tasks[1].priority).not.toBe(task2.priority);
	expect(tasks[1].completed).not.toBe(task2.completed);
});

test('Should extend a task', () => {
	const moreInfo = { notes: 'Leche deslactosada', place: 'supermercado' };
	planner.updateTask(1, { ...moreInfo });
	expect(planner.getTasks()).toStrictEqual([
		{ ...task1, completed: true, ...moreInfo },
		{ ...task2, priority: 1, completed: true },
	]);
});
