import fs from 'node:fs';
import { exec } from 'child_process';

let files = [];

const printList = () => {
	for (let i = 0; i < files.length; i++) {
		console.log(`[${i + 1}] ${files[i]}`);
	}
};

const instructions = () => {
	console.log('\nSelecciona un ejercicio o presiona:\n e para salir, r reiniciar');
};

const execTest = (test) => {
	test = files[test - 1];

	console.log(`\n****** Ejecutando test [${test}] ******\n`);

	exec(
		`node --experimental-vm-modules node_modules/jest/bin/jest.js ./exercises/${test}/${test}.test.js`,
		(err, stdout, stderr) => {
			if (err) throw Error(err);

			console.log(stdout || stderr);
			console.log('\n****** Test finalizado ******');
			instructions();
		}
	);
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
