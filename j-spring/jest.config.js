module.exports = process.env.BABEL_ENV === "test" ? {
    globals: {
      'ts-jest': {
        packageJson: 'package.json',
      }
    },
    rootDir: __dirname,
  }:{
    transform: {
      '.(ts|tsx)$': require.resolve('ts-jest/dist'),
      '.(js|jsx)$': require.resolve('babel-jest'),
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  }