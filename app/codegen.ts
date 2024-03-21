import { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const config: CodegenConfig = {
  schema: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
  documents: ['{app,source,utils,wp-blocks}/**/*.{tsx,ts}'],
  generates: {
    './types/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
