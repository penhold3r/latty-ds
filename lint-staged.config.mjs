export default {
  '*.{ts,tsx,mts,cts,js,mjs,cjs,astro}': ['prettier --write', 'eslint --fix'],
  '*.{css,json,md}': ['prettier --write']
};
