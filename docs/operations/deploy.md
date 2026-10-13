# 배포 런북

> **기획 시작 시 Claude에게 아래 질문을 받고 이 파일을 채운다:**
>
> 1. 배포 플랫폼이 어디야? (Vercel / AWS / Railway / Fly.io / 기타)
> 2. 스테이징 환경이 있어?
> 3. 자동 배포(CI/CD) 연결할 거야, 수동 배포할 거야?
> 4. 필요한 환경변수가 뭐야?

---

## 배포 플랫폼

> {플랫폼 선택 후 아래 해당 섹션을 채우고 나머지는 삭제}

---

### Vercel

**자동 배포**
- `main` 브랜치 push → 프로덕션 자동 배포
- 다른 브랜치 push → 프리뷰 URL 자동 생성

**수동 배포**
```bash
npx vercel --prod
```

**롤백**
1. Vercel 대시보드 → Deployments
2. 마지막 정상 배포 → "..." → "Promote to Production"

---

### AWS (Amplify / EC2 / ECS)

**자동 배포**
- GitHub Actions → AWS 배포 파이프라인 연결

**수동 배포**
```bash
# Amplify
amplify publish

# ECS
aws ecs update-service --cluster {cluster} --service {service} --force-new-deployment
```

**롤백**
- Amplify: 대시보드 → 이전 빌드 → Redeploy
- ECS: 이전 태스크 정의 버전으로 서비스 업데이트

---

### Railway

**자동 배포**
- GitHub 연결 시 `main` 브랜치 push → 자동 배포

**수동 배포**
```bash
railway up
```

**롤백**
- Railway 대시보드 → Deployments → 이전 배포 → Rollback

---

### Fly.io

**자동 배포**
```bash
fly deploy
```

**롤백**
```bash
fly releases list
fly deploy --image {이전 이미지}
```

---

## 환경 변수

| 변수 | 필수 여부 | 설명 | 환경 |
|------|-----------|------|------|
| {변수명} | 필수 | {설명} | production |

> `.env.local`은 절대 git에 커밋하지 않는다.
> `.env.example`에 키 목록만 커밋한다.

---

## 환경 구분

| 환경 | 브랜치 | URL |
|------|--------|-----|
| production | `main` | {프로덕션 URL} |
| staging | `staging` | {스테이징 URL} |
| preview | PR 브랜치 | 자동 생성 |

---

## 배포 체크리스트

- [ ] 환경변수 모두 설정 확인
- [ ] DB 마이그레이션 적용 확인
- [ ] 스테이징 환경 동작 확인
- [ ] 빌드 성공 확인
- [ ] 배포 후 핵심 기능 수동 테스트

---

## 헬스 체크

```bash
curl -I {프로덕션 URL}  # 200 응답 확인
```
