module.exports = {
  "extends": ["airbnb-base", "plugin:jest-formatting/recommended"],
  "env": { "jest": true },
  "ignorePatterns": [".eslintrc.js"],
  "rules": {
    "import/no-extraneous-dependencies": "off",
    "array-bracket-spacing": "off",
    "arrow-parens": ["warn", "as-needed"],
    "comma-dangle": ["error", "always-multiline"],
    "consistent-return": "off",
    "indent": ["error", 2, { "SwitchCase": 1 }],
    "linebreak-style": ["error", "unix"],
    "object-curly-newline": "off",
    "padded-blocks": ["warn", { "classes": "always" }],
    "quotes": ["warn", "single", { "avoidEscape": true }],
    "semi": ["warn", "never"],
    "space-before-function-paren": ["warn", {
      "anonymous": "always",
      "named": "ignore",
      "asyncArrow": "always"
    }],
    "no-underscore-dangle": "off",
  }
}
