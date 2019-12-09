const { useBabelRc, override, useEslintRc } = require('customize-cra')

module.exports = override(
  useBabelRc(),
  useEslintRc()
);
/*
module.exports = function(api) {
    const presets = [];
    const plugins = [
        '@babel/plugin-proposal-optional-chaining'
    ];
    return {presets, plugins};
}
*/