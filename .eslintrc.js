module.exports = {
  "parser": "babel-eslint",
  "env": {
    "node": true
  },
  "globals": {
    "expect": true,
    "describe": true,
    "it": true,
    "beforeEach": true
  },
  "plugins": [
    'flow-header',
    'flowtype'
  ],
  "extends": ['airbnb', 'plugin:flowtype/recommended'],
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js"]
      }
    }
  },
  "rules": {
    "flowtype/generic-spacing": "off",
    "flow-header/flow-header": 2,
    "react/jsx-curly-brace-presence": "off",
    "import/prefer-default-export": "off",
    "no-param-reassign": "off",
    // TODO: create issue on eslint github
    "arrow-parens": "off",
  }
}
