module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "rules": {
    "react/sort-comp": 0,
    "react/prop-types": 0,
    "no-useless-escape": 1,
    "max-len": [1, 151],
    "no-unused-vars": [1],
    "import/prefer-default-export": 1,
    "import/no-extraneous-dependencies": 1,
    "import/no-unresolved": 1,
    "jsx-a11y/label-has-for": 1,
    "jsx-a11y/anchor-is-valid": 1,
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [
          ".js",
        ],
      },
    ],
  },
  "env": {
    "browser": true,
  },
};