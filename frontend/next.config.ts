import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export',
  // trailingSlash: true, // 경로 끝에 /를 붙여 정적 파일 구조 최적화
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
