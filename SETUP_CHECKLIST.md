# ✅ GitHub Pages 배포 설정 체크리스트

## 🎯 목표
`https://jumoooo.github.io/front_7th_chapter3-2/` 에서 `src/advanced` 화면이 표시되도록 설정

---

## 📋 외부적으로 해야 할 작업 (순서대로)

### ✅ 1단계: 코드 변경사항 커밋 & Push

```bash
# 변경된 파일 확인
git status

# 모든 변경사항 추가
git add .

# 커밋
git commit -m "chore: front_7th_chapter3-1 패턴으로 GitHub Pages 배포 설정"

# GitHub에 push
git push
```

---

### ✅ 2단계: GitHub 저장소 Settings → Pages 설정 (가장 중요!)

1. **GitHub 저장소로 이동**
   - URL: `https://github.com/jumoooo/front_7th_chapter3-2`

2. **Settings 탭 클릭**
   - 저장소 상단 메뉴에서 `Settings` 클릭

3. **Pages 메뉴 선택**
   - 왼쪽 사이드바에서 `Pages` 클릭

4. **Source 설정 변경** ⚠️ **가장 중요!**
   - **Source** 드롭다운에서 **"GitHub Actions"** 선택
   - `Save` 버튼 클릭
   
   > 💡 참고: "Deploy from a branch"가 아니라 **"GitHub Actions"**를 선택해야 합니다!

---

### ✅ 3단계: GitHub Actions 워크플로우 확인

1. **Actions 탭으로 이동**
   - 저장소 상단 메뉴에서 `Actions` 클릭
   - 또는: `https://github.com/jumoooo/front_7th_chapter3-2/actions`

2. **"Deploy to GitHub Pages" 워크플로우 확인**
   - 왼쪽 사이드바에서 워크플로우 목록 확인
   - `Deploy to GitHub Pages` 워크플로우가 보여야 합니다

3. **워크플로우 실행 확인**
   - push 후 자동으로 실행됩니다
   - 워크플로우가 실행 중이거나 완료된 것을 확인
   - ✅ 초록색 체크마크가 보이면 성공!

4. **실패했다면**
   - 빨간색 X 표시가 보이면 로그 확인
   - 에러 메시지 확인 후 해결

---

### ✅ 4단계: 배포 완료 확인

1. **배포 완료 대기**
   - 워크플로우 실행 후 1-2분 정도 대기

2. **배포된 페이지 접속**
   - URL: `https://jumoooo.github.io/front_7th_chapter3-2/`
   - `src/advanced` 화면이 표시되어야 합니다!

3. **404 에러가 나온다면**
   - 브라우저 캐시 지우기: `Ctrl + Shift + R` (Windows) 또는 `Cmd + Shift + R` (Mac)
   - 또는 시크릿 모드로 접속
   - 2-3분 더 기다려보기

---

## ❓ 문제 해결

### 문제 1: Settings → Pages에 "GitHub Actions" 옵션이 보이지 않아요
- **해결**: 저장소가 Private이면 GitHub Pages가 제한될 수 있습니다. Public으로 변경하거나 GitHub Pro가 필요할 수 있습니다.

### 문제 2: GitHub Actions 워크플로우가 실행되지 않아요
- **해결**: 
  ```bash
  # 빈 커밋으로 트리거
  git commit --allow-empty -m "trigger deployment"
  git push
  ```

### 문제 3: 워크플로우가 실패해요
- **해결**: 
  - Actions 탭에서 실패한 워크플로우 클릭
  - 에러 로그 확인
  - 대부분의 경우 `pnpm-lock.yaml` 문제일 수 있습니다
  - 로컬에서 `pnpm install` 실행 후 다시 커밋

### 문제 4: 여전히 404 에러가 나와요
- **체크리스트**:
  - [ ] Settings → Pages에서 Source가 "GitHub Actions"로 설정되었나요?
  - [ ] GitHub Actions 워크플로우가 성공적으로 완료되었나요?
  - [ ] gh-pages 브랜치가 생성되었나요? (`https://github.com/jumoooo/front_7th_chapter3-2/branches`)
  - [ ] gh-pages 브랜치에 `index.html` 파일이 있나요?
  - [ ] 브라우저 캐시를 지웠나요?

---

## 📝 완료 체크리스트

- [ ] 코드 변경사항 커밋 & push 완료
- [ ] GitHub Settings → Pages에서 Source를 "GitHub Actions"로 설정
- [ ] GitHub Actions 워크플로우가 성공적으로 실행됨
- [ ] `https://jumoooo.github.io/front_7th_chapter3-2/` 에서 정상 접속 확인
- [ ] `src/advanced` 화면이 정상적으로 표시됨

---

## 🎉 완료!

모든 체크리스트를 완료했다면 배포가 성공한 것입니다!

배포된 페이지: `https://jumoooo.github.io/front_7th_chapter3-2/`

---

**참고 문서:**
- `GITHUB_PAGES_SETUP.md` - 상세 설정 가이드
- `GITHUB_PAGES_TROUBLESHOOTING.md` - 문제 해결 가이드

