const path = require('path');
const plugin = require('../src/index.js');
const {pluginTester} = require('babel-plugin-tester');

pluginTester({
  plugin,
  fixtures: path.join(__dirname, 'fixtures'),
  title: 'babel-plugin-remove-test-id',
});
