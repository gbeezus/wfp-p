'use client';

import { WordPressBlocksViewer } from '@faustwp/blocks';
import { flatListToHierarchical } from '@faustwp/core';
import { isNotNullNorUndefined } from '../../utils/isNullOrUndefined';

interface BlocksViewerProps {
  blocks: Array<Record<string | number, unknown> | null> | undefined;
}
function BlocksViewer({ blocks }: BlocksViewerProps): JSX.Element {
  const blockList = flatListToHierarchical(
    blocks?.filter(isNotNullNorUndefined),
    {
      idKey: 'clientId',
      parentKey: 'parentClientId',
      childrenKey: 'innerBlocks',
    },
  );
  return <WordPressBlocksViewer blocks={blockList} />;
}

export default BlocksViewer;
