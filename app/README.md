# Faust.js Experimental Frontend

## Initial Setup

1. Run [nvm](https://github.com/nvm-sh/nvm) so your local node version matches the project's node version:
    ```bash
    nvm use
    ```

1. Install dependencies locally. This helps some IDEs using tools like IntelliSense to properly wireup packages to your app files,
   or if you simply want to run `npm` commands outside of `ddev`.
   View the `README.nextjs.md` file to see how to run commands outside of ddev.
    ```bash
    npm ci
    ```

## Starting and stopping the project

After following the "Initial Setup" instructions, you can start the local development server for the app by running:
```bash
npm run dev
```
Open http://localhost:3000/ with your browser to see the app. If using storybook, use port `6006` by default to view it: http://localhost:6006/.

## Icons
After adding a new SVG to `source/01-global-icon/svgs`, you will need to
generate the React components:
```bash
npm run build-icons
```

### Start storybook
```bash
npm run storybook
```

### Start application in production mode

```bash
npm run start
```

## Notes

* Code for the app is currently configured to go into the `pages` directory (for [Next.js pages](https://nextjs.org/docs/basic-features/pages)) and `source` for theming, components, providers, helpers, etc.
* Starting in Next.js v9.4, TypeScript errors do not show up in your browser when running the dev server (i.e. `npm run dev`). However, TS errors will prevent `next build` (i.e. `npm run build`) from running successfully. You can run `npm run lint` and `npm run tsc` to check for issues, which will give you lint and TS errors that will most likely cause your builds to fail. Note also that if you have [`husky`](https://typicode.github.io/husky/#/) installed, these will automatically run when you attempt to commit to a branch.
* The current favicon implementation will probably not display correctly locally in Chrome (v94), but does display correctly in Firefox and Safari. Note that the favicon _does_ display correctly once deployed. Not sure why.
