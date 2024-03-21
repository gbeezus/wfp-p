import { registerBlockType } from '@wordpress/blocks';
import Edit from './_Edit';
import Save from './_Save';
import metadata from './block.json';
import './post-selector.scss';
registerBlockType('custom-block-library/post-selector', {
	...metadata,
	edit: Edit,
	save: Save,
});
