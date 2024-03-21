import { gql } from '@apollo/client';
import { getClient } from '@faustwp/experimental-app-router';
import { Metadata } from 'next';
import Link from 'next/link';
import Main from '../source/02-layouts/Main/Main';
import Article from '../source/03-components/Article/Article';
import {
  GetIndexPostsQuery,
  HomeMetadataQuery,
} from '../types/__generated__/graphql';

export async function generateMetadata(): Promise<Metadata> {
  const client = await getClient();

  const { data } = await client.query<HomeMetadataQuery>({
    query: gql`
      query HomeMetadata {
        generalSettings {
          title
          description
        }
      }
    `,
  });

  return {
    title: data.generalSettings?.title || '',
    description: data.generalSettings?.description || '',
  };
}

export default async function Home() {
  const client = await getClient();

  const { data } = await client.query<GetIndexPostsQuery>({
    query: gql`
      query GetIndexPosts {
        posts {
          nodes {
            id
            title
            uri
            slug
          }
        }
      }
    `,
  });

  if (!data.posts) {
    throw new Error('Query failed.');
  }

  return (
    <Main>
      <Article title="Posts">
        <ul>
          {data.posts.nodes.map(post => (
            <li key={post.id}>
              <Link href={`/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </Article>
    </Main>
  );
}
