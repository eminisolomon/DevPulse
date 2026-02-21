const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('sql');

// Add SVG support
config.transformer.babelTransformerPath =
  require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg',
);
config.resolver.sourceExts.push('svg');

// Add WASM support for SQLite Web
config.resolver.assetExts.push('wasm');

module.exports = config;
