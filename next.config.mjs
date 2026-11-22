/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // The old /shopNow route is kept alive so previously shared links don't 404.
  // (Redirect sources match case-insensitively, so /signUp -> /signup would loop.)
  async redirects() {
    return [{ source: "/shopNow", destination: "/shop", permanent: true }];
  },
};

export default nextConfig;
