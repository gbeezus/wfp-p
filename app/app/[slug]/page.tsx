import { getAuthClient, getClient } from '@faustwp/experimental-app-router';
import { notFound } from 'next/navigation';
import Main from '../../source/02-layouts/Main/Main';
import Article from '../../source/03-components/Article/Article';
import DynamicRouteProps from '../../types/DynamicRouteProps';
import {
  ContentNodeIdTypeEnum,
  GetContentNodeQuery,
  GetContentNodeQueryVariables,
} from '../../types/__generated__/graphql';
import { hasPreviewProps } from '../../utils/hasPreviewProp';
import getContentNodeQuery from '../../utils/queries/getContentNodeQuery';
import BlocksViewer from './BlocksViewer';
import LoginForm from './LoginForm';

export default async function Page(props: DynamicRouteProps<'slug'>) {
  const isPreview = hasPreviewProps(props);
  const id = isPreview ? props.searchParams.p : props.params.slug;

  const client = isPreview ? await getAuthClient() : await getClient();
  if (!client) {
    // If no client, this means that the user is attempting to see preview
    // and that the user is currently not "logged in" on the app.
    // Show the login form so user can do so.
    return <LoginForm />;
  }

  const idString = Array.isArray(id) ? id[0] : id;
  if (!idString) {
    // Page ID/slug not found in props.
    return notFound();
  }

  const { data } = await client.query<
    GetContentNodeQuery,
    GetContentNodeQueryVariables
  >({
    query: getContentNodeQuery,
    variables: {
      id: idString,
      idType: isPreview
        ? ContentNodeIdTypeEnum.DatabaseId
        : ContentNodeIdTypeEnum.Uri,
      asPreview: isPreview,
    },
  });

  if (!data.contentNode) {
    // Content not found in WordPress.
    return notFound();
  }

  const editorBlocks =
    ('editorBlocks' in data.contentNode && data.contentNode.editorBlocks) ||
    undefined;

  return (
    <Main>
      <Article title={data.contentNode.title}>
        <BlocksViewer blocks={editorBlocks} />
      </Article>
    </Main>
  );
}
