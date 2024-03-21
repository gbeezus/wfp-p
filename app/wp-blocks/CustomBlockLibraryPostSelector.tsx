import { gql } from '@apollo/client';
import { CustomBlockLibraryPostSelectorFragmentFragment } from '../types/__generated__/graphql';

function CustomBlockLibraryPostSelector({
  post,
}: CustomBlockLibraryPostSelectorFragmentFragment): JSX.Element {
  const imgSrc = post?.featuredImage?.node.sourceUrl;
  return (
    <div>
      <div>CustomBlockLibraryPostSelector</div>
      {post ? <h3>{post.title}</h3> : <strong>No post selected.</strong>}
      {imgSrc ? <img alt="" src={imgSrc} /> : null}
    </div>
  );
}

CustomBlockLibraryPostSelector.config = {
  name: 'CustomBlockLibraryPostSelector',
};
CustomBlockLibraryPostSelector.displayName = 'CustomBlockLibraryPostSelector';
CustomBlockLibraryPostSelector.fragments = {
  key: `CustomBlockLibraryPostSelectorFragment`,
  entry: gql`
    fragment CustomBlockLibraryPostSelectorFragment on CustomBlockLibraryPostSelector {
      post {
        title
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `,
};

export default CustomBlockLibraryPostSelector;
