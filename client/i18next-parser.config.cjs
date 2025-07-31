module.exports = {
    locales: ['bg', 'en'],
    defaultNamespace: 'translation',
    defaultValue: '',
    useKeysAsDefaultValue: true,
    keySeparator: false,
    namespaceSeparator: false,
    createOldCatalogs: false,
    sort: true,
    output: 'src/locales/$LOCALE/$NAMESPACE.json',
    input: ['src/**/*.{ts,tsx}'],
    verbose: true
  };