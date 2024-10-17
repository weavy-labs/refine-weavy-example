<div align="center">
<a href="https://refine.dev/">
  <img alt="refine logo" src="https://refine.ams3.cdn.digitaloceanspaces.com/readme/refine-readme-banner.png">
</a>
</div>

# Weavy Refine Example

This example will show you an example how to integrate [Weavy](https://www.weavy.com) into a Refine app. This includes integrating authorization, theming and notifications.

The example is based on the standard [Refine NextJS example using NextAuth with Ant Design](https://refine.dev/docs/examples/next-js/NextAuth-js/).

## Prerequisites

- A [Weavy account](https://get.weavy.com/sign-up) and Weavy API key
- [Node.js](https://nodejs.org/)

## Install dependencies

```bash
npm install
```

## Configure Weavy

For the Weavy components to work, you need to provide a `WEAVY_URL`and `WEAVY_APIKEY` environment variable.
These can be defined in an `.env` file in the root of the project (see [.env.example](./.env.example)).

```ini
# .env
NEXT_PUBLIC_WEAVY_URL="https://example.weavy.io" # Your Weavy environment URL
WEAVY_APIKEY="wys_*********" # Your secret API key
```

## Run the demo

### Production mode

To start the *Production mode* you need to compile the app first. When it's compiled, you can start the *production mode* and open the app running at [http://localhost:3000](http://localhost:3000) to see the example in full action.

```bash
npm run build
npm start
```

### Developer mode

Start the *dev mode* and open the preview running at [http://localhost:3000](http://localhost:3000) to see the example in full action.

```bash
npm run dev
```
