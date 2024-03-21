import { withFaust } from '@faustwp/core';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';

const basePath = '';

/** @type {import('next').NextConfig} */
export default withFaust({
  // TODO: Figure out if we need. Taken from app-router example of faust
  // https://github.com/wpengine/faustjs/blob/canary/examples/next/app-router/next.config.js#L6-L10
  // headers: async () => {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: createSecureHeaders({
  //         xssProtection: false,
  //       }),
  //     },
  //   ];
  // },
  reactStrictMode: true,
  basePath,
  eslint: {
    dirs: ['app', 'source'],
  },
  /**
   * Custom Webpack Config
   * https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
   */
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_BASEPATH': JSON.stringify(basePath || ''),
      }),
    );

    config.plugins.push(
      new StylelintWebpackPlugin({
        exclude: ['node_modules', 'storybook'],
      }),
    );

    return config;
  },
});
