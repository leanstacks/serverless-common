# @leanstacks/react-common

A suite of common React components used to compose React applications for the LeanStacks organization.

## Requirements

This library requires the following

- Node [LTS](https://github.com/nodejs/Release) 16.x or 18.x (preferable)
- React ^18.2.0
- TailwindCSS ^3.3.0

## Install

To install this library, issue the following command in your react project

```shell
npm install @leanstacks/react-common
```

### Configure Tailwind

LeanStacks components are styled with [TailwindCSS](https://tailwindcss.com/). You must include this library in your project's Tailwind configuration so that Tailwind styles are applied to the components from this library.

In your project, create or open your `tailwind.config.js` file. Ensure that LeanStacks library paths are included by adding `'./node_modules/@leanstacks/**/*.{js,jsx,ts,tsx}'` to the `content` section.

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/@leanstacks/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
```

See the [Tailwind installation guide](https://tailwindcss.com/docs/installation) for more details about this configuration file.

## Use

To use React components from the library in your React application, simply import the desired component(s) and use them as you would any React component.

```typescript
import { Text, TextVariant } from '@leanstacks/react-common';

const MyComponent: React.FC = () => {
  return (
    <Text variant={TextVariant.Heading1} className="mb-4">
      Welcome to React!
    </Text>
  );
};
```

## Editor

To prevent warnings from Tailwind CSS rules, install a plugin like the [Tailwind CSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) plugin for Visual Studio Code.

If you are using Prettier, you may also install the [Prettier plugin for Tailwind](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) that will automatically sort Tailwind classes in the recommended order.

## License

[MIT License](./LICENSE)
