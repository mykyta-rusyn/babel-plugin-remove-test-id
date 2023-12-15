another pluginother plugin with the same idea](https://github.com/coderas/babel-plugin-jsx-remove-data-test-id.git), here we have some preferences. Instead of removing specified attributes only from jsx code and object properties, you can remove all files with your `test-id` from the bundle.
In most cases creating separate file help improve readability in our components and tests, and there is no reason why we should leave unnecessary files in bundles.

## Install

```bash
npm i --save-dev babel-plugin-remove-test-id 
```

## API Reference

There are no default values, so you need to provide your custom for every type, you want.
If the option is not provided this step is skipped.

```javascript
[
    'babel-plugin-jsx-remove-data-test-id',
    {
        importFileNames: 'file-with-test-ids',
        testIdObjects: 'object-with-test-ids',
        jsxAttributes: 'test-id-jsx-attribute',
        objectProperties: 'test-id-property',
    }
]
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `importFileNames` | `string` or `Array<string>` | Name(s) of file(s) that should be removed  |
| `testIdObjects` | `string` or `Array<string>` | If the file is removed, we can still have the imported object in the code. Example: `someFunction(ObjectWithTestId.Text)` -> `someFunction(undefined)`. Now not working with function calls like `func(Obj.func())` |
| `jsxAttributes` | `string` or `Array<string>` | Name(s) of attribute(s) that should be removed in jsx components. Use can provide an array, for example `['testid', 'buttonTestid', 'textTestid']`  |
| `objectProperties` | `string` or `Array<string>` | Name(s) of object property(-ies) that should be removed. Example: `someFunction({testid: ObjectWithTestId.Text})` -> `someFunction({})` |

`importNames` was replaced by `testIdObjects` in v2.0.0.

### Usage

Be careful while adding this package directly into your plugin's array, because your test will be failed. Better choose any of these variants:
- Babel environment configuration:
```javascript
    ...,
    env: {
        production: {
            plugins: [
                ...,
                [
                    'babel-plugin-remove-test-id',
                    {
                        importFileNames: 'file-with-test-ids',
                        testIdObjects: 'object-with-test-ids',
                        jsxAttributes: 'test-id-jsx-attribute',
                        objectProperties: 'test-id-property',
                    }
                ],
                ...
            ]
        },
        test: {
            plugins: [...]
        }
    },
    ...
```
- Custom environment configuration:
```javascript
const plugins = [...];

if (process.env.REMOVE_TEST_ID) {
    plugins.push([
        'babel-plugin-remove-test-id',
        {
            importFileNames: 'file-with-test-ids',
            testIdObjects: 'object-with-test-ids',
            jsxAttributes: 'test-id-jsx-attribute',
            objectProperties: 'test-id-property',
        }
    ])
}

module.export = {
    presets: [...],
    plugins
}
```
- Predefined `*.json` files for each environment:
```javascript
const fs = require('fs');

fs.writeFileSync(
    'path-to-file/babel.config.js',
    process.env.REMOVE_TEST_ID
        ? require('path-to-predefined/bundle.production.json')
        : require('path-to-predefined/bundle.test.json')
)
```

### Examples

Add your test id property into HTML tags
```typescript
return (
  <div>
    <p data-test-id="component-text">someText</p>
  </div>
);
```
or into React Native components
```typescript
return (
  <View>
    <Text testID='any-test-id-value'>someText</Text>
  </View>
)
```
or into function calls
```typescript
function TextArgumentTestId(testid) {
    return <Text testID={testid}>{testid}</Text>
}

function TextObjectPropTestId({testid}: {testid: string}) {
    return <Text testid={testid}>{testid}</Text>
}

const textArgumentTestId = TextArgumentTestId('test-id-argument');
const textObjectPropTestId = TextObjectPropTestId({testid: 'test-id-prop'});

return (
    <View>
        <TextObjectPropTestId testid={'test-id-jsx-attribute'} />
        {textArgumentTestId}
        {textObjectPropTestId}
    </View>
)
```
of import file
```javascript
import ObjectWithTestId from './FileWithTestIds'
```
Start your app and check bundle.