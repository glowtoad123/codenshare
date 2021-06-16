const withPWA = require('next-pwa')
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})

module.exports = withPWA({
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  pwa: {
    dest: 'public',
    register: true,
  },
  env: {
    NEXT_FAUNA_KEY: 'fnADpgTNT1ACEiUC4G_M5eNjnIPvv_eL99-n5nhe'
  },
  target: 'serverless'
})

/* module.exports = (
    withMDX({
      pageExtensions: ['js', 'jsx', 'md', 'mdx'],
    }),

    {
      env: {
        NEXT_FAUNA_KEY: 'fnADpgTNT1ACEiUC4G_M5eNjnIPvv_eL99-n5nhe'
      },
      target: 'serverless'
    }
) */