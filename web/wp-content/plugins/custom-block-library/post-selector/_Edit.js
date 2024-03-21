import { useBlockProps } from '@wordpress/block-editor';
import { SelectControl } from '@wordpress/components';
import { useMemo } from 'react';
const { useSelect } = wp.data;

function Edit({ attributes, setAttributes, isSelected }) {
	const { selectedPostId } = attributes;
	const blockProps = useBlockProps({
		className: 'post-selector',
	});

	// querying for posts
	const { media, posts } = useSelect((select) => {
		const { getEntityRecords, getMedia } = select('core');
		const query = {
			status: 'publish',
			per_page: -1,
		};
		const postArray = getEntityRecords('postType', 'post', query);
		// Get record of featured media for each post.
		const mediaRecord = {};
		postArray?.forEach((post) => {
			const item = getMedia(post.featured_media);
			mediaRecord[post.id] = item?.source_url;
		});
		return {
			media: mediaRecord,
			posts: postArray,
		};
	});

	const { allPostData, options } = useMemo(() => {
		const postData = {};
		const optionsArray = [];
		if (posts) {
			optionsArray.push({ value: 0, label: 'Select a post' });
			posts.forEach((post) => {
				postData[post.id] = {
					value: post.id,
					label: post.title.rendered,
				};
				optionsArray.push({
					value: post.id,
					label: post.title.rendered,
				});
			});
		} else {
			optionsArray.push({ value: -1, label: 'Loading...' });
		}
		return { allPostData: postData, options: optionsArray };
	}, [posts]);

	// Events
	function updateCustomValues(id) {
		if (!allPostData[id]) {
			// Post not found in data. This means that either we are still loading,
			// or that the "Select a post" option was selected.
			// Either way, set attribute to the defaults.
			// TODO: Should we instead throw an error?
			setAttributes({
				selectedPostId: -1,
				selectedPostTitle: 'Post Title',
				selectedPostImage: '',
			});
			return;
		}
		setAttributes({
			selectedPostId: parseInt(allPostData[id].value),
			selectedPostTitle: allPostData[id].label,
			selectedPostImage: media[id],
		});
	}

	return (
		<>
			{isSelected && (
				<div {...blockProps}>
					<SelectControl
						label="Select a post"
						options={options}
						value={selectedPostId}
						onChange={(newValue) => updateCustomValues(newValue)}
					/>
				</div>
			)}

			{!isSelected && (
				<div {...blockProps}>
					<div className={'post-selector__opaque'}></div>
					<div
						className={'post-selector__background'}
						style={{
							backgroundImage: attributes.selectedPostImage
								? `url(${attributes.selectedPostImage})`
								: undefined,
						}}
					></div>
					<h2>{attributes.selectedPostTitle}</h2>
				</div>
			)}
		</>
	);
}
export default Edit;
