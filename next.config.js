/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  // cacheComponents: true,
  experimental: {
    // ppr: 'incremental',
    
  },
  images: {
    remotePatterns: [
      new URL('https://fantasy-media.cbssports.com/baseball/siliconvalley/ealsm1LqkKSOqPRQ.jpg'),
    ],
  },
};



export default config;