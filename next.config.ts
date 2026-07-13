import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default withBotId(nextConfig);
