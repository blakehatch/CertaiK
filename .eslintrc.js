const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
  },
  extends: [
    "next",
    "prettier",
    "eslint:recommended",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:cypress/recommended",
  ],
  plugins: ["import", "prettier"],
  rules: {
    "no-underscore-dangle": "off",
    "no-extra-semi": OFF,
    "no-unescaped-entities": OFF,
    "no-restricted-syntax": [ERROR, "WithStatement"],
    "@typescript-eslint/quotes": [ERROR, "double"],
    "@typescript-eslint/no-shadow": WARN,
    "import/export": OFF,
    quotes: [ERROR, "double"],
    "no-console": OFF,
    "@typescript-eslint/explicit-function-return-type": OFF,
    "@typescript-eslint/no-var-requires": WARN,
    "@typescript-eslint/return-await": OFF,
    "max-len": [
      ERROR,
      {
        code: 110,
        ignoreUrls: true,
        ignoreComments: false,
      },
    ],
    "@typescript-eslint/indent": OFF, // https://github.com/typescript-eslint/typescript-eslint/issues/1824,
    "@typescript-eslint/no-implied-eval": OFF, // trade-off for faster linting without parserOptions setting
    "@typescript-eslint/no-throw-literal": OFF, // trade-off for faster linting without parserOptions setting
    "import/no-cycle": process.env.HUSKY ? OFF : ERROR,
    "@typescript-eslint/no-unused-vars": ERROR,
    "@typescript-eslint/prefer-optional-chain": WARN,
    "import/extensions": OFF,
    "prettier/prettier": [
      ERROR,
      {
        endOfLine: "auto",
      },
    ],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": [WARN],
      },
    },
    {
      files: ["*.test.*"],
      rules: {
        "import/no-named-as-default-member": OFF,
      },
    },
    {
      files: ["assets/**/*.tsx", "styles/*.tsx"],
      rules: {
        "max-len": [OFF],
        "@typescript-eslint/no-explicit-any": [OFF],
      },
    },
  ],
  env: {
    browser: true,
    jest: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
      },
    },
  },
};