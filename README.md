# dev-template-frontend

Frontend development template intended for use on Webflow sites.

This template uses Typescript and is intended to speed up the development process for coding for Webflow sites, if you do not want to use Typescript, I would suggest using a site like https://codesandbox.io/ to write your javascript for your site.

## what's inside

-   JQuery types

This project interacts with Webflow, hence the `window.Webflow.push()` in index.ts. The callback function will execute after Webflow's script has executed, if you would like to run code before that, keep it outside of the callback. Weflow includes JQuery on all its sites, so this template includes types for it. Feel free to use JQuery inside of the callback.

-   Finsweet TS Utils

This project also includes [Finsweet's Typescript Utils](https://github.com/finsweet/ts-utils), which includes some useful functions to help with developing for Webflow sites.

## Getting Started

This project uses pnpm, you can install it via npm:

```bash
npm i -g pnpm
```

Then, cd into the project directory and install dependencies:

```bash
pnpm install
```

After that, write some code and build the project

`pnpm dev`: build and create a server on localhost to serve your files, the console provides a script tag to paste into your webflow <head> tag.

`pnpm build`: build (and minify) files to (`dist`)
