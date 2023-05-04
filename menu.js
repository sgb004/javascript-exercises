import fs from 'node:fs';
import chalk from 'chalk';

export default class Menu {
	files = [];

	init() {
		fs.readdir('./exercises', (err, result) => {
			if (err) throw Error(err);

			this.files = result;

			console.clear();
			this.printList();
			this.instructions();

			process.stdin.on('data', (data) => {
				data = data.toString().trim();
				if (data.match(/^[0-9]+$/)) {
					data = parseInt(data);
					if (data > 0 && data <= this.files.length) {
						this.execExercise(data).then(() => {
							this.instructions();
						});
					} else {
						console.log('\nEjercicio no encontrado');
						this.instructions();
					}
				} else if (data === 'e') {
					console.log('\nAdios!');
					process.exit();
				} else if (data === 'r') {
					console.clear();
					this.printList();
					this.instructions();
				} else {
					console.log('\nOpción no válida');
					this.instructions();
				}
			});
		});
	}

	printList() {
		console.log(chalk.bold('EJERCICIOS:\n'));

		for (let i = 0; i < this.files.length; i++) {
			console.log(`[${chalk.bold(i + 1)}] ${this.files[i]}`);
		}
	}

	instructions() {
		console.log(
			`\nSelecciona un ejercicio o presiona:\n ${chalk.bold('e')} para salir, ${chalk.bold(
				'r'
			)} reiniciar`
		);
	}

	execExercise(data) {
		return new Promise((resolve, reject) => {
			console.log('Executing exercise');
			console.log({ data });
			resolve();
		});
	}
}
