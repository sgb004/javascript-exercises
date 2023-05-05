import fs from 'node:fs';
import { exec } from 'child_process';
import chalk from 'chalk';
import Menu from './menu.js';
import nodemon from 'nodemon';
import path from 'path';

class Devels extends Menu {
	execExercise(test) {
		return new Promise((resolve, reject) => {
			test = this.files[test - 1];

			this.blockStdin = true;

			fs.readFile(`./exercises/${test}/README.md`, 'utf8', (err, data) => {
				let filePath = path.resolve(`exercises/${test}/${test}.js`);

				console.log(
					chalk.bold(
						`\n****** Descripción del ejercicio [${chalk.blueBright(test)}] ******\n`
					)
				);

				if (err) {
					console.log('Sin descripción');
				} else {
					console.log(data.trim());
				}

				console.log(
					chalk.bold(`\n****** Depurando ejercicio [${chalk.blueBright(test)}] ******\n`)
				);

				nodemon({
					script: filePath,
					watch: filePath,
				});

				filePath = chalk.greenBright(filePath);

				nodemon
					.on('start', () => console.log(`Depurando: ${filePath}`))
					.on('quit', () => {
						console.log(`\nFin de la depuración de: ${filePath}`);
						nodemon.removeAllListeners();
						this.instructions();
						this.blockStdin = false;
					});
			});
		});
	}
}

const devels = new Devels();
devels.init();
