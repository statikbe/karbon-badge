export default ({ command }) => ({
  publicDir: false,
  build: {
    emptyOutDir: true,
    outputDir: "dist",
    minify: "terser",
    rollupOptions: {
      input: {
        karbon: "src/karbon-badge.js",
        index: "index.html",
      },
      output: {
        entryFileNames: "karbon-badge.min.js",
      },
    },
  },
});
