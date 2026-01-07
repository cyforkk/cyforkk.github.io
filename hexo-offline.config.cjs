module.exports = {
  globPatterns: ['**/*.{js,html,css,png,jpg,jpeg,gif,svg,webp,eot,ttf,woff,woff2}'],
  globDirectory: 'public',
  swDest: 'public/sw.js',
  maximumFileSizeToCacheInBytes: 10485760,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'jsdelivr-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60
        }
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60
        }
      }
    }
  ],
  skipWaiting: true,
  clientsClaim: true
};
