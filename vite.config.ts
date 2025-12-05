import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { copyFileSync } from "fs";

// ESM 환경에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 빌드 후 index.advanced.html을 index.html로 복사하는 플러그인
function copyIndexPlugin(): Plugin {
  return {
    name: "copy-index-html",
    closeBundle() {
      // 빌드가 완료된 후 실행
      const distPath = path.resolve(__dirname, "dist");
      const sourceFile = path.join(distPath, "index.advanced.html");
      const targetFile = path.join(distPath, "index.html");

      try {
        copyFileSync(sourceFile, targetFile);
        console.log("✅ index.advanced.html이 index.html로 복사되었습니다.");
      } catch (error) {
        // 파일이 없으면 무시 (개발 모드에서 빌드하지 않은 경우)
        console.warn("⚠️ index.advanced.html 파일을 찾을 수 없습니다.");
      }
    },
  };
}

// GitHub Pages 배포를 위한 base 경로 설정
// 저장소 이름이 URL에 포함되므로 저장소 이름을 base 경로로 설정
const base: string =
  process.env.NODE_ENV === "production" ? "/front_7th_chapter3-2/" : "";

export default mergeConfig(
  defineConfig({
    base, // GitHub Pages 배포 경로 설정
    plugins: [react(), copyIndexPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // 빌드 시 index.advanced.html을 index.html로 사용
    // 개발 모드에서는 각 dev 스크립트에서 다른 HTML 파일을 명시적으로 지정하므로 문제 없음
    build: {
      rollupOptions: {
        input: path.resolve(__dirname, "index.advanced.html"),
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  })
);
