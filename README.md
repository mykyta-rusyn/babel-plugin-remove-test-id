# babel-plugin-remove-test-id

Remove specified jsx-attributes, file imports, object properties, function calls arguments from your production builds.

Based on the [other plugin with the same idea](https://github.com/coderas/babel-plugin-jsx-remove-data-test-id.git), but here we got some preferences. Instead of removing specified attributes only from jsx code and object properties, you can remove all files with your `test-id` from bundle.
In most cases creating separate file help improve readability in our components and tests, and there is no reason why we should leave unnecessary files in bundles.

## Install

```bash
npm i --save-dev babel-plugin-remove-test-id 
```


## API Reference

There are no default values, so you need to provide your custom for every type, what you want use.
If option not provided this step skipping.

```javascript
[
    'babel-plugin-jsx-remove-data-test-id',
    {
        importFileName: 'file-with-test-ids',
        importName: 'object-with-test-ids',
        jsxAttributes: 'test-id-jsx-attrbiute',
        objectProperties: 'test-id-property',
    }
]
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `importFileName` | `string` or `Array<string>` | Name(s) of file(s) that should be removed  |
| `importName` | `string` or `Array<string>` | If file removed, we can still have imported object in code. Example: `someFunction(ObjectWithTestId.Text)` -> `someFunction(undefined)` |
| `jsxAttributes` | `string` or `Array<string>` | Name(s) of attribute(s) that should be removed in jsx components. Use can provide array like `['testid', 'buttonTestid', 'textTestid']`  |
| `objectProperties` | `string` or `Array<string>` | Name(s) of object property(-ies) that should be removed. Example: `someFunction({testid: ObjectWithTestId.Text})` -> `someFunction({})` |

### Usage

Be careful while adding this package directly into your plugins array, besauce your test will failed. Better choose any of this variants:
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
                        importFileName: 'file-with-test-ids',
                        importName: 'object-with-test-ids',
                        jsxAttributes: 'test-id-jsx-attrbiute',
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
            importFileName: 'file-with-test-ids',
            importName: 'object-with-test-ids',
            jsxAttributes: 'test-id-jsx-attrbiute',
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

Add your test id property into html tags
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