import type { NextConfig } from "next";

// Product photography is WebP with alpha and goes through the image optimizer.
// No SVG is passed to next/image any more (the OG images and the logo are
// served as plain static files), so `dangerouslyAllowSVG` is no longer needed.
const nextConfig: NextConfig = {};

export default nextConfig;
