// npm audit (high 이상) 게이트. 패치가 없는 알려진 항목만 IGNORE에 등록한다.
// 새 취약점은 그대로 실패한다. 패치가 나오면 해당 항목을 반드시 삭제할 것.
import { execSync } from 'node:child_process'

const IGNORE = {
  // braces <=3.0.3 중첩 패턴 DoS — 패치 버전 없음, shadcn CLI(빌드 시) 하위 의존성
  'GHSA-vfj7-8cjw-p6xm': '2026-10-14 패치 없음 (shadcn > fast-glob > micromatch > braces)',
}

let raw
try {
  raw = execSync('npm audit --json', { encoding: 'utf8', maxBuffer: 1e8 })
} catch (e) {
  raw = e.stdout // npm audit은 취약점이 있으면 비정상 종료한다
}

const report = JSON.parse(raw)
const found = new Map()
for (const v of Object.values(report.vulnerabilities ?? {})) {
  for (const via of v.via) {
    if (typeof via === 'object' && ['high', 'critical'].includes(via.severity)) {
      found.set(via.url.split('/').pop(), via)
    }
  }
}

const blocking = [...found].filter(([id]) => !(id in IGNORE))
for (const [id, why] of Object.entries(IGNORE)) {
  if (found.has(id)) console.log(`  ⚠ 예외 적용: ${id} — ${why}`)
}
if (blocking.length) {
  for (const [id, a] of blocking) console.error(`  ✗ ${a.severity} ${a.name}: ${a.title} (${id})`)
  process.exit(1)
}
