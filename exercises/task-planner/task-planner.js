class TaskPlanner {
	#tasks = [];

	addTask(task) {
		task = this.sanitize({ ...task });
		this.validate(task);

		if (this.findTask(task.id) != -1) {
			throw new Error(`El tag con id ${task.id} ya esta registrado.`);
		}

		if (this.findTaskByName(task.name) != -1) {
			throw new Error(`El tag con el nombre ${task.name} ya esta registrado.`);
		}

		task.completed = task.completed ?? false;

		this.#tasks.push(task);
	}

	validate(task) {
		if (typeof task.id !== 'number') throw new Error('El id no es un tipo válido.');
		if (typeof task.name !== 'string') throw new Error('El nombre no es un tipo válido.');
		if (typeof task.priority !== 'number' || isNaN(task.priority))
			throw new Error('La prioridad no es un tipo válido.');
		if (task.priority < 1 || task.priority > 3)
			throw new Error('La prioridad debe ser un número entre 1 y 3.');
		if (!Array.isArray(task.tags)) throw new Error('Los tags no son un array.');
		if (task.tags.find((tag) => typeof tag !== 'string') !== undefined)
			throw new Error('Los tags no tienen un tipo válido.');
		if (typeof task.completed != 'boolean' && typeof task.completed != 'undefined')
			throw new Error('El valor de completado debe ser un tipo boleano.');
	}

	sanitize(task) {
		task.priority = parseInt(task.priority);
		return task;
	}

	findTask(id) {
		return this.#tasks.findIndex((task) => task.id === id);
	}

	findTaskByName(name) {
		return this.#tasks.findIndex((task) => task.name === name);
	}

	getTask(id) {
		return this.#tasks.filter((task) => task.id === id);
	}

	removeTask(value) {
		this.#tasks = this.#tasks.filter((task) => task.id !== value && task.name !== value);
	}

	getTasks() {
		return this.#tasks;
	}

	getPendingTasks() {
		return this.#tasks.filter((task) => task.completed == false);
	}

	getCompletedTasks() {
		return this.#tasks.filter((task) => task.completed == true);
	}

	markTaskAsCompleted(value) {
		this.#tasks = this.#tasks.map((task) => {
			//No se valida el tipo de dato para permitir marcar como completadas las tareas que tubieran el id y el nombre igual
			if (task.id != value || task.name != value) {
				task.completed = true;
			}
			return task;
		});
	}

	getSortedTasksByPriority() {
		const tasks = [...this.#tasks];
		return tasks.sort((a, b) => a.priority - b.priority);
	}

	filterTasksByTag(tag) {
		return this.#tasks.filter((task) => task.tags.find((t) => t == tag));
	}

	updateTask(taskId, updates) {
		const index = this.findTask(taskId);

		if (index == -1) {
			throw new Error(`El tag con id ${taskId} no esta registrado.`);
		} else {
			let task = { ...this.#tasks[index], ...updates, id: taskId };
			task = this.sanitize(task);
			this.validate(task);
			this.#tasks[index] = task;
		}
	}
}

export const createTaskPlanner = () => new TaskPlanner();
