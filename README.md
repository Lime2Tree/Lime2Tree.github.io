# 황경화 포트폴리오

정적 HTML/CSS/JS로 만든 개인 포트폴리오 페이지. 빌드 과정 없이 GitHub Pages로 바로 배포 가능함.

## 배포 방법 (GitHub Pages)

1. 이 폴더 전체를 새 GitHub 저장소에 push함 (`git init` → `git add .` → `git commit` → `git remote add origin ...` → `git push`)
2. 저장소의 **Settings → Pages**로 이동
3. **Branch**를 `main`(또는 사용 중인 브랜치), 폴더는 `/ (root)`로 선택 후 저장 — 몇 분 내로 `https://<사용자명>.github.io/<저장소명>/` 주소에서 확인 가능함

## 올리기 전에 확인할 것

- `assets/resume.pdf` — 다운로드 버튼이 이 경로를 가리키고 있음. 실제 이력서 PDF(공개해도 되는 버전으로, 생년월일·자택 주소는 뺀 버전 권장)를 이 이름으로 넣을 것
- `index.html` 안의 `<!-- TODO -->` 주석 2곳 — 발주처 미확인 프로젝트 2건, 실제 발주처 알게 되면 채워 넣을 것
- `#contact` 섹션의 `id="githubLink"` — 본인 GitHub 프로필 URL로 `href` 교체
- 원하면 LinkedIn 링크도 연락처 섹션에 같은 스타일로 추가 가능

## 로컬에서 미리보기

빌드 도구 없이 `index.html`을 브라우저로 바로 열어도 되고, 더 정확한 미리보기를 원하면:

```bash
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

## 폴더 구조

```
/
├── index.html          # 페이지 본문
├── css/style.css        # 스타일 (고정폭 1120px 컨테이너 + 반응형)
├── js/main.js            # 스크롤 애니메이션, 별자리 캔버스, 모바일 메뉴
├── assets/profile.jpg    # 프로필 사진
└── README.md
```
