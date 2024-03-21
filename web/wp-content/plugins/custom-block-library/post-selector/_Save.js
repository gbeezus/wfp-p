import { useBlockProps } from '@wordpress/block-editor';
function Save({ attributes }) {
	const blockProps = useBlockProps.save({
		className: 'post-selector',
	});
	return (
		<div {...blockProps}>
			<img src={attributes.selectedPostImage} alt={''} />
			<h2>{attributes.selectedPostTitle}</h2>
		</div>
	);
}
export default Save;
