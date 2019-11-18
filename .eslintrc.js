module.exports = {
  root: true,
  "extends": ["airbnb"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
  },
  "plugins": ["@typescript-eslint", "jest"],
  "settings": {
    "import/parsers": {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    "import/resolver": {
      typescript: {},
    },
  },
  "rules": {
    "react/sort-comp": 0,
    "react/prop-types": 0,
    "no-useless-escape": 1,
    "max-len": [1, 151],
    // ESLint `no-unused-vars` fails when imports are used as type annotations
    "no-unused-vars": 0,
    "@typescript-eslint/no-unused-vars": ['error', { 'vars': 'all', 'args': 'none' }],
    // Until fixed: https://github.com/SoominHan/import-sorter/issues/48
    "import/no-useless-path-segments": 0,
    "import/prefer-default-export": 1,
    "import/no-extraneous-dependencies": 0,
    "import/no-unresolved": 1,
    "jsx-a11y/label-has-for": 1,
    "jsx-a11y/anchor-is-valid": 1,
    "react/jsx-filename-extension": [
      2,
      {
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx",
        ],
      },
    ],
    "react/destructuring-assignment": [0],
  },
  "env": {
    "browser": true,
    "jest/globals": true
  },
};
