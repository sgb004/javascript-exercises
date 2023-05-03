import fs from 'node:fs';
import { exec } from 'child_process';
import chalk from 'chalk';
import spinner from 'simple-spinner';

let files = [];

const printList = () => {
	console.log(chalk.bold('EJERCICIOS:\n'));

	for (let i = 0; i < files.length; i++) {
		console.log(`[${chalk.bold(i + 1)}] ${files[i]}`);
	}
};

const instructions = () => {
	console.log(
		`\nSelecciona un ejercicio o presiona:\n ${chalk.bold('e')} para salir, ${chalk.bold(
			'r'
		)} reiniciar`
	);
};

const execTest = (test) => {
	test = files[test - 1];

	fs.readFile(`./exercises/${test}/README.md`, 'utf8', (err, data) => {
		console.log(
			chalk.bold(`\n****** Descripción del test [${chalk.blueBright(test)}] ******\n`)
		);

		if (err) {
			console.log('Sin descripción');
		} else {
			console.log(data.trim());
		}

		console.log(chalk.bold(`\n****** Ejecutando test [${chalk.blueBright(test)}] ******\n`));
		spinner.start({ sequence: 'dots12', text: 'Cargando...' });

		exec(
			`node --experimental-vm-modules node_modules/jest/bin/jest.js ./exercises/${test}/${test}.test.js --colors`,
			(err, stdout, stderr) => {
				if (err) throw Error(err);
				spinner.stop();

				console.log(stdout || stderr);
				console.log(chalk.bold('\n****** Test finalizado ******'));
				instructions();
			}
		);
	});
};

fs.readdir('./exercises', (err, result) => {
	if (err) throw Error(err);

	files = result;

	console.clear();
	printList();
	instructions();

	process.stdin.on('data', (data) => {
		data = data.toString().trim();
		if (data.match(/^[0-9]+$/)) {
			data = parseInt(data);
			if (data > 0 && data <= files.length) {
				execTest(data);
			} else {
				console.log('\nEjercicio no encontrado');
				instructions();
			}
		} else if (data === 'e') {
			console.log('\nAdios!');
			process.exit();
		} else if (data === 'r') {
			console.clear();
			printList();
			instructions();
		} else {
			console.log('\nOpción no válida');
			instructions();
		}
	});
});
