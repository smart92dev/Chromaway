This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It also includes:

- [o] [`flowbite`](https://flowbite.com)
- [x] [`flowbite-react`](https://flowbite-react.com)
- [x] [`react-icons`](https://react-icons.github.io/react-icons)
- [x] [`tailwindcss`](https://tailwindcss.com)
- [x] [`next-auth`](https://next-auth.js.org/)
- [x] [`rainbowkit`](https://www.rainbowkit.com/)
- [x] [`wagmi`](https://wagmi.sh/)
- [x] [`viem`](https://viem.sh/)
- [x] Quality of life tools, like
  - [x] [`eslint`](https://eslint.org) with some plugins
  - [x] [`prettier`](https://prettier.io)

# Project requirements.
- Authentication & Connection with Blockchain Networks
  - Used nextAuth.js, rainbowkit, wagmi for  user authentication and session management
  - Compatible with Metamask
  - Support two chains (Ethereum mainnet, Bsc Testnet)
  - Handle cases when a user switches to an unsupported network
- Display user's crypto assets
  - Display cryptocurrenty balance on connected chan and CHR token balance after connected
  - Allow CHR token for send
  - Send CHT token to another wallet
- Sending Cryptocurrencies
  - Send cryptocurrencies to another wallet

## Getting started

`Next.js` requires [`Node.js`](https://nodejs.org).

If you don't already have `npm` and `yarn` available, make sure you set them up. In my case I used `yarn`

```bash
npm i -g npm yarn
```
If node_modules directory doesn't created, make `.yarnrc.yml` file on the root directory and add following line.

```bach
nodeLinker: node-modules
```

Install the dependencies:

```bash
yarn install
```

Now you can run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
