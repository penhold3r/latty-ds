/** @type {import("prettier").Config}  */
module.exports = {
  printWidth: 120,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "none",
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: { parser: 'astro' },
    },
  ],
};
