# 6. Демо

-----

## HOST config

```ts
new ModuleFederationPlugin({
  name: 'host5001',
  // library: { type: 'var', name: 'host5001' },
  // filename: 'remoteEntry.js',
  remotes: {
    /* ✨✨✨ `@` is an undocumented DamnMagic! 🤯 */
    remote5002: 'remote5002@', // for import(`remote5002/Button`)
  },
  shared: {
    react: {
      requiredVersion: '17.0.1',
      singleton: true,
    },
  },
})

```

-----

## REMOTE config

```ts
new ModuleFederationPlugin({
  name: 'remote5002',
  library: { type: 'var', name: 'remote5002' },
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/expose/Button.tsx',
    './customCalc': './src/expose/customCalc.ts',
  },
  shared: {
    react: {
      requiredVersion: '17.0.1',
      singleton: true,
    },
  },
})

```

-----

<https://github.com/nodkz/module-federation-demo>
