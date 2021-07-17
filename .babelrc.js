module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: "3.14.0",
        targets: {
          chrome: "60",
          ie: "11",
        },
      },
    ],
    [
      "@babel/preset-react",
      {
        development: process.env.NODE_ENV === "development",
        pragma: "dom",                  // default pragma is React.createElement
        pragmaFrag: "DomFrag",          // default is React.Fragment
        throwIfNamespace: false         // defaults to true
      },
    ],
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    "@babel/plugin-syntax-dynamic-import",
  ]
};
