# Easy UI Icons

Easy UI Icons is a package containing the icons that experiences can use to build on the EasyPost platform, and contains SVG files in the `svg` directory.

Easy UI Icons generally uses a subset of [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols).

```
Set: Material Symbols
Style: Outlined
Fill: 0
Weight: 300
Grade: Normal
Size: 48dp
```

## Getting started

Although it’s possible to use this package directly, we recommend using the icons in this package through [Easy UI React](https://github.com/EasyPost/easy-ui/tree/main/easy-ui-react) in combination with the `Icon` component.

## Installation

1. Install Easy UI React ([instructions](https://github.com/EasyPost/easy-ui/tree/main/easy-ui-react)) if you haven’t already.

2. Install Easy UI Icons as a dependency:

   Using [npm](https://www.npmjs.com/):

   ```
   npm install @easypost/easy-ui-icons --save
   ```

## Usage

Import the `Icon` component from Easy UI React and any icon from Easy UI Icons into your project.

1. Import the icon component from Easy UI React:

   ```tsx
   import Icon from "@easypost/easy-ui/Icon";
   ```

2. Import an icon from Easy UI Icons:

   ```tsx
   import CheckCircleIcon from "@easypost/easy-ui-icons/CheckCircle";
   ```

3. Pass the imported Easy UI icon to the `symbol` prop of the `Icon` component:

   ```tsx
   <Icon symbol={CheckCircleIcon} />
   ```

Icons imported as illustrated above will assume a weight of 300. To import an icon with a different weight, add the weight as a suffix to the path.

```tsx
import Icon400 from "@easypost/easy-ui/Icon400";
```

### SVG files

For projects that don’t use React and need the raw SVG, icons are available as `*.svg` files in the `svg` folder.

```js
import svgFile from "@easypost/easy-ui-icons/svg/Info.svg";
```

## Development

### Commands

| Command         | Runs                     |
| :-------------- | :----------------------- |
| `npm run clean` | Removes temp directories |
| `npm run build` | Builds the icons project |

### Adding an icon

Add icons to the `src/` folder. Easy UI Icons supports custom SVG files and JSON files referencing Material Symbol configurations.

All icons in `src/` are transpiled to React components and re-exported as raw SVGs on build.

#### Material Symbols

Add a new Material Symbol icon by specifying a named JSON file with a Material Symbols configuration.

`Check.json`:

```json
{
  "name": "check",
  "style": "outlined",
  "source": "@material-symbols/svg-300"
}
```

To add a new Material Symbol icon with a weight other than 300, update the above to reflect it as so; using a weight of 400 as an example:

`Check400.json`:

```json
{
  "name": "check",
  "style": "outlined",
  "source": "@material-symbols/svg-400"
}
```
