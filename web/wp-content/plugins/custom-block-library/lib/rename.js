/* eslint-env node */
/* eslint-disable no-console */

const inquirer = require('inquirer');
const path = require('path');
const fsPromises = require('fs/promises');

/**
 * Creates the machine name from a human-readable name.
 *
 * @param {string} name - The human-readable name
 * @return {string} - The machine name
 */
function machineName(name) {
	return name.split(' ').join('-').toLowerCase();
}

/**
 * Creates a human name from a machine name.
 *
 * @param {string} name - The machine name
 * @return {string} - The human-readable name
 */
function humanName(name) {
	const words = name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
	return words.join(' ');
}

async function getNewName() {
	const question = [
		{
			type: 'input',
			name: 'pluginName',
			message: 'What is the new name of your plugin?',
			filter: machineName,
		},
	];
	const { pluginName } = await inquirer.prompt(question);
	return pluginName.trim();
}

async function getNewTitle(newName) {
	const questions = [
		{
			type: 'input',
			name: 'pluginTitle',
			message: 'What is the new title of your plugin?',
			default: humanName(newName),
		},
		{
			type: 'input',
			name: 'pluginDescription',
			message: 'What is your plugin description?',
			default: 'A collection of custom blocks',
		},
	];
	const { pluginTitle, pluginDescription } = await inquirer.prompt(questions);
	return [pluginTitle.trim(), pluginDescription.trim()];
}

async function searchAndReplace(
	file,
	currentDirectory,
	newName,
	newTitle,
	newDescription
) {
	const fileText = await fsPromises.readFile(
		path.join(currentDirectory, file),
		'utf-8'
	);
	const updatedText = fileText
		.replace(/blocks-plugin-template/g, newName)
		.replace(/blocks_plugin_template/g, newName.replace(/-/g, '_'))
		.replace(/\[TITLE]/g, newTitle)
		.replace(/\[DESCRIPTION]/g, newDescription);
	return fsPromises.writeFile(file, updatedText);
}

async function init() {
	const currentDirectory = process.cwd();
	const newName = await getNewName();
	const [newTitle, newDescription] = await getNewTitle(newName);
	const filesToUpdate = [
		'blocks-plugin-template.php',
		'package.json',
		'README.md',
	];
	const searches = filesToUpdate.map((file) =>
		searchAndReplace(
			file,
			currentDirectory,
			newName,
			newTitle,
			newDescription
		)
	);
	await Promise.all(searches);
	await fsPromises.rename(
		path.join(currentDirectory, 'blocks-plugin-template.php'),
		path.join(currentDirectory, `${newName}.php`)
	);
	await fsPromises.rename(
		currentDirectory,
		`${path.dirname(currentDirectory)}/${newName}`
	);
}

init().catch((err) => {
	console.error(err);
});
