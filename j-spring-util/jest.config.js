module.exports = process.env.BABEL_ENV === "test" ? {
  globals: {
    'ts-jest': {
      packageJson: 'package.json',
    }
  },
  rootDir: __dirname,
  moduleNameMapper:{
    axios:'<rootDir>/node_modules/axios/dist/axios.js'
  }
}:{
  transform: {
    '.(ts|tsx)$': require.resolve('ts-jest/dist'),
    '.(js|jsx)$': require.resolve('babel-jest'),
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
}