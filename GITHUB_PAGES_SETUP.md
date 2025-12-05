# 🚀 GitHub Pages 배포 설정 완료

## ✅ 완료된 작업

1. **vite.config.ts 설정**

   - GitHub Pages를 위한 base path 설정: `/front_7th_chapter3-2/`
   - 빌드 시 `index.advanced.html`을 사용하도록 설정

2. **package.json 스크립트 추가**

   - `build:advanced`: advanced 버전을 빌드하는 스크립트 추가

3. **GitHub Actions 워크플로우 생성**
   - `.github/workflows/deploy.yml` 파일 생성
   - main 브랜치에 push 시 자동 배포

## 🔧 외부적으로 해야 할 작업

### 0단계: pnpm-lock.yaml 업데이트 후 커밋

⚠️ **중요**: `@types/node` 패키지를 추가했으므로, 로컬에서 다음 명령어를 실행한 후 커밋해야 합니다:

```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update pnpm-lock.yaml after adding @types/node"
git push
```

이렇게 하지 않으면 GitHub Actions에서 `ERR_PNPM_OUTDATED_LOCKFILE` 오류가 발생합니다.

### 1단계: GitHub 저장소 Settings 확인

1. **GitHub 저장소로 이동**

   - 저장소 URL: `https://github.com/사용자명/front_7th_chapter3-2`
   - (저장소 이름이 다를 경우, vite.config.ts의 base path도 함께 수정 필요)

2. **Settings → Pages 메뉴로 이동**

   - 저장소 상단 메뉴에서 `Settings` 클릭
   - 왼쪽 사이드바에서 `Pages` 선택

3. **Source 설정 변경**

   - **옵션 1: GitHub Actions (권장) ✅**

     - Source: `GitHub Actions` 선택
     - 자동으로 워크플로우가 배포를 처리합니다
     - **참고**: `gh-pages` 브랜치는 아직 없어도 괜찮습니다! GitHub Actions가 첫 배포 시 자동으로 생성합니다.

   - **옵션 2: gh-pages 브랜치**
     - Source: `Deploy from a branch` 선택
     - Branch: `gh-pages` 선택 (첫 배포 후에만 나타남)
     - Folder: `/ (root)` 선택
     - Save 클릭
     - ⚠️ 이 방법은 첫 배포 후에만 사용할 수 있습니다

### 2단계: GitHub Actions 실행 확인

1. **Actions 탭으로 이동**

   - 저장소 상단 메뉴에서 `Actions` 클릭
   - `https://github.com/사용자명/front_7th_chapter3-2/actions`

2. **"Deploy to GitHub Pages" 워크플로우 확인**
   - 워크플로우 목록에서 `Deploy to GitHub Pages` 확인
   - main 브랜치에 push하면 자동으로 실행됩니다
   - 워크플로우가 성공적으로 완료되는지 확인

### 3단계: 배포 확인

배포가 완료되면 다음 URL에서 확인할 수 있습니다:

```
https://사용자명.github.io/front_7th_chapter3-2/
```

**예시:**

- `https://jumoooo.github.io/front_7th_chapter3-2/`

## ❓ 자주 묻는 질문 (FAQ)

### Q: gh-pages 브랜치가 없는데 괜찮나요?

**A: 네, 완전히 정상입니다!**

`gh-pages` 브랜치는 GitHub Actions가 첫 배포를 실행할 때 **자동으로 생성**됩니다.

- 현재 브랜치가 없어도 문제 없습니다
- GitHub Actions 워크플로우가 실행되면 `peaceiris/actions-gh-pages@v3` 액션이 자동으로:
  1. `gh-pages` 브랜치 생성
  2. 빌드된 파일들(`dist` 폴더) 업로드
  3. GitHub Pages에 배포

따라서 GitHub Settings → Pages에서 **"GitHub Actions"**를 Source로 선택하기만 하면 됩니다.

## 🔍 문제 해결

### ❌ README.md가 나올 때 (현재 문제)

**증상**: `https://jumoooo.github.io/front_7th_chapter3-2/`에 접속하면 README.md 내용이 표시됨

**원인**: GitHub Pages 설정이 잘못되어 있거나, 빌드된 파일이 배포되지 않았습니다.

**해결 방법**:

1. **GitHub Settings → Pages 확인** (가장 중요!)

   - 저장소로 이동: `https://github.com/jumoooo/front_7th_chapter3-2`
   - Settings → Pages 메뉴로 이동
   - **Source가 "GitHub Actions"로 설정되어 있는지 확인**
   - 만약 "Deploy from a branch"로 되어 있다면:
     - Source를 **"GitHub Actions"**로 변경
     - Save 클릭

2. **GitHub Actions 워크플로우 실행 확인**

   - Actions 탭으로 이동: `https://github.com/jumoooo/front_7th_chapter3-2/actions`
   - "Deploy to GitHub Pages" 워크플로우가 실행되었는지 확인
   - 실행되지 않았다면, 빈 커밋을 만들어 push:
     ```bash
     git commit --allow-empty -m "trigger deployment"
     git push
     ```
   - 워크플로우가 실패했다면 로그를 확인하고 오류 해결

3. **gh-pages 브랜치 확인**

   - 브랜치 목록: `https://github.com/jumoooo/front_7th_chapter3-2/branches`
   - `gh-pages` 브랜치가 있는지 확인
   - 있다면 브랜치 내용 확인: `https://github.com/jumoooo/front_7th_chapter3-2/tree/gh-pages`
   - `index.html` 파일이 있어야 합니다

4. **빌드 로컬 테스트**
   ```bash
   pnpm build:advanced
   ls -la dist/
   ```
   - `dist/index.html` 파일이 생성되는지 확인

### 배포가 안 될 때

1. **GitHub Actions 실행 확인**

   - Actions 탭에서 워크플로우가 실행되었는지 확인
   - 에러가 있다면 로그 확인

2. **저장소 이름 확인**

   - 저장소 이름이 `front_7th_chapter3-2`와 다르다면
   - `vite.config.ts`의 base path를 실제 저장소 이름에 맞게 수정 필요

3. **gh-pages 브랜치 확인**
   - Settings → Pages에서 gh-pages 브랜치 사용 시
   - 브랜치에 파일이 있는지 확인

### 404 에러가 날 때

- vite.config.ts의 base path가 저장소 이름과 일치하는지 확인
- GitHub Pages 설정에서 올바른 브랜치/폴더가 선택되었는지 확인
- 브라우저 캐시를 지우고 다시 접속 (Ctrl + Shift + R 또는 Cmd + Shift + R)

## 📝 참고 사항

- 배포 후 변경사항이 반영되는데 몇 분 정도 소요될 수 있습니다
- 브라우저 캐시를 지우고 다시 접속해보세요 (Ctrl + Shift + R 또는 Cmd + Shift + R)
- 배포된 페이지는 `src/advanced` 폴더의 내용이 표시됩니다
