/* eslint-env node */
/* eslint-disable no-console */

const inquirer = require('inquirer');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
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

/**
 * Get the machine name from user input.
 *
 * @return {Promise<string>} - Machine name of new block
 */
async function getMachineName() {
	const question = [
		{
			type: 'input',
			name: 'blockName',
			message: 'What is the name of your block?',
			filter: machineName,
		},
	];
	const { blockName } = await inquirer.prompt(question);
	return blockName.trim();
}

/**
 * Get additional details about the block from user input.
 *
 * @param {string} blockName - The machine name of the component
 * @return {Promise<*>} - User responses
 */
async function getBlockDetails(blockName) {
	const defaultBlockTitle = humanName(blockName);
	const detailedQuestions = [
		{
			type: 'input',
			name: 'blockTitle',
			message: 'What is the human-readable title of your component?',
			default: defaultBlockTitle,
		},
		{
			type: 'list',
			name: 'category',
			message: 'Block category',
			choices: ['text', 'media', 'design', 'widgets', 'theme', 'embed'],
		},
		{
			type: 'confirm',
			name: 'stylesheet',
			message: 'Create a separate SCSS file?',
			default: false,
		},
	];
	return inquirer.prompt(detailedQuestions);
}

/**
 * Create the block.json file for the block.
 *
 * @param {string}  moduleName - The outer directory/plugin name
 * @param {string}  blockName  - The machine name for the block
 * @param {string}  blockTitle - The human-readable name for the block
 * @param {string}  category   - The block category
 * @param {boolean} stylesheet - Whether to generate a block stylesheet
 * @return {Promise<void>}
 */
function createBlockJson(
	moduleName,
	blockName,
	blockTitle,
	category,
	stylesheet
) {
	const output = `{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 2,
  "name": "${moduleName}/${blockName}",
  "title": "${blockTitle}",
  "category": "${category}",
  "editorScript": "file:../build/${blockName}.js"${stylesheet ? ',' : ''}
  ${stylesheet ? `"style": "file:../build/${blockName}.css"` : ''}
}`;
	return fsPromises.writeFile(
		path.join(blockName, `block.json`),
		output,
		(err) => (err ? console.error(err) : null)
	);
}

/**
 * Create the _Edit.js module for the block.
 *
 * @param {string} blockName - The directory name for the block
 * @return {Promise<void>}
 */
function createEditJs(blockName) {
	const output = `import { useBlockProps } from '@wordpress/block-editor';
function Edit() {
  const blockProps = useBlockProps({
    className: '${blockName}',
  });
  return (<div {...blockProps}></div>);
}
export default Edit;
`;
	return fsPromises.writeFile(
		path.join(blockName, `_Edit.js`),
		output,
		(err) => (err ? console.error(err) : null)
	);
}

/**
 * Create the _Save.js module for the block.
 *
 * @param {string} blockName - The directory name for the block
 * @return {Promise<void>}
 */
function createSaveJs(blockName) {
	const output = `import { useBlockProps } from '@wordpress/block-editor';
function Save() {
  const blockProps = useBlockProps.save({
    className: '${blockName}',
  });
  return (<div {...blockProps}></div>);
}
export default Save;
`;
	return fsPromises.writeFile(
		path.join(blockName, `_Save.js`),
		output,
		(err) => (err ? console.error(err) : null)
	);
}

/**
 * Create the index.js file for the block
 *
 * @param {string}  moduleName - The outer directory/plugin name
 * @param {string}  blockName  - The machine name for the block
 * @param {boolean} stylesheet - Whether to generate a block stylesheet
 * @return {Promise<void>}
 */
function createJs(moduleName, blockName, stylesheet) {
	const output = `import { registerBlockType } from '@wordpress/blocks';
import Edit from './_Edit';
import Save from './_Save';
import metadata from './block.json';
${stylesheet ? `import './${blockName}.scss';` : ''}
registerBlockType('${moduleName}/${blockName}', {
  ...metadata,
  edit: Edit,
  save: Save
});
`;
	return fsPromises.writeFile(
		path.join(blockName, `index.js`),
		output,
		(err) => (err ? console.error(err) : null)
	);
}

/**
 * Create the stylesheet for the block.
 *
 * @param {string} blockName - The machine name for the block
 * @return {Promise<void>}
 */
function createScss(blockName) {
	const output = `// .${blockName}{}`;
	return fsPromises.writeFile(
		path.join(blockName, `${blockName}.scss`),
		output,
		(err) => (err ? console.error(err) : null)
	);
}

async function addToPhpFile(moduleName, blockName) {
	const currentDirectory = process.cwd();
	if (fs.existsSync(path.join(currentDirectory, `${moduleName}.php`))) {
		let fileContents = await fsPromises.readFile(
			path.join(currentDirectory, `${moduleName}.php`),
			'utf-8'
		);
		const functionIndex = fileContents.indexOf('_register_blocks() {');
		if (functionIndex === -1) {
			return new Promise((resolve, reject) =>
				reject('Register block function not found.')
			);
		}
		fileContents = `${fileContents.slice(0, functionIndex + 20)}
\tregister_block_type_from_metadata(__DIR__ . '/${blockName}');
${fileContents.slice(functionIndex + 21)}
`;
		return fsPromises.writeFile(
			path.join(currentDirectory, `${moduleName}.php`),
			fileContents
		);
	}
	return new Promise((resolve, reject) => reject('No PHP file found'));
}

/**
 * Create all files for a new block.
 *
 * @param {string}  blockDir   - The directory name for the block
 * @param {string}  moduleName - The outer directory/plugin name
 * @param {string}  blockName  - The machine name for the block
 * @param {string}  blockTitle - The human readable name for the block
 * @param {string}  category   - The category for the block
 * @param {boolean} stylesheet - Whether to generate a block stylesheet
 *
 * @return  {Promise<void>}
 */
async function createBlock(
	blockDir,
	moduleName,
	blockName,
	blockTitle,
	category,
	stylesheet
) {
	if (fs.existsSync(blockDir)) {
		console.error('Block directory already exists');
	} else {
		try {
			await mkdirp(blockDir);
		} catch (err) {
			console.error(err);
		}

		const blockFiles = [
			createBlockJson(
				moduleName,
				blockName,
				blockTitle,
				category,
				stylesheet
			),
			createEditJs(blockName),
			createSaveJs(blockName),
			createJs(moduleName, blockName, stylesheet),
			addToPhpFile(moduleName, blockName),
		];
		if (stylesheet) {
			blockFiles.push(createScss(blockName));
		}
		const results = await Promise.allSettled(blockFiles);
		let success = true;
		results.forEach((result) => {
			if (result.status !== 'fulfilled') {
				success = false;
				console.error(result.status.reason);
			}
		});
		if (success) {
			console.log(`Block ${blockTitle} created.`);
		} else {
			console.log(
				'Not all block files were created successfully. You may need to manually create or update files.'
			);
		}
	}
}

/**
 * Initialize a new block.
 *
 * @return {Promise<void>}
 */
async function init() {
	const blockLocation = process.cwd();
	const moduleName = path.basename(blockLocation);
	const blockName = await getMachineName();
	const { blockTitle, category, stylesheet } =
		await getBlockDetails(blockName);
	const output = `---
Block Name: ${moduleName}/${blockName}
Block Title: ${blockTitle}
Category: ${category}
`;
	console.log(output);
	const confirmQuestion = [
		{
			type: 'confirm',
			name: 'confirm',
			message: 'Is this what you want?',
		},
	];
	const { confirm } = await inquirer.prompt(confirmQuestion);
	if (confirm) {
		await createBlock(
			path.join(blockLocation, blockName),
			moduleName,
			blockName,
			blockTitle,
			category,
			stylesheet
		);
	} else {
		console.log('Block canceled');
	}
}

init().catch((err) => {
	console.error(err);
});
