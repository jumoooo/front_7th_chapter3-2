import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

// ESM 환경에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub Pages 배포를 위한 base 경로 설정
// 저장소 이름이 URL에 포함되므로 저장소 이름을 base 경로로 설정
const base: string =
  process.env.NODE_ENV === "production" ? "/front_7th_chapter3-2/" : "";

export default mergeConfig(
  defineConfig(({ command }) => {
    const isBuild = command === "build";

    return {
      base, // GitHub Pages 배포 경로 설정
      plugins: [react()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      // 빌드 시 index.advanced.html을 index.html로 사용
      ...(isBuild
        ? {
            build: {
              rollupOptions: {
                input: path.resolve(__dirname, "index.advanced.html"),
              },
            },
          }
        : {}),
    };
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  })
);
