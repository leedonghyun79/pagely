import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { SiteSchema, type Site } from '@/lib/schema/site'
import { applyOps, type Op } from '@/lib/site/ops'

/**
 * 로컬 JSON 파일 저장소. 호출부는 이 모듈의 함수만 쓰므로
 * 나중에 Postgres 등으로 바꿀 때 이 파일만 교체하면 된다.
 */

export interface Revision {
  id: string
  siteId: string
  /** 이 변경을 적용하기 *전*의 사이트. 되돌리기에 쓴다. */
  snapshot: Site
  ops: Op[]
  author: 'ai' | 'user'
  summary: string
  createdAt: string
}

const dataDir = () => process.env.DATA_DIR ?? path.join(process.cwd(), 'data')
const siteFile = (id: string) => path.join(dataDir(), 'sites', `${safeId(id)}.json`)
const revFile = (id: string) => path.join(dataDir(), 'revisions', `${safeId(id)}.json`)

function safeId(id: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new Error('잘못된 id')
  return id
}

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T
  } catch {
    return null
  }
}

function writeJson(file: string, data: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8')
}

export function getSite(id: string): Site | null {
  const raw = readJson<unknown>(siteFile(id))
  if (!raw) return null
  const parsed = SiteSchema.safeParse(raw)
  return parsed.success ? parsed.data : null
}

export function saveSite(site: Site): void {
  writeJson(siteFile(site.id), SiteSchema.parse(site))
}

export function listSites(): Pick<Site, 'id' | 'name'>[] {
  const dir = path.join(dataDir(), 'sites')
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => getSite(f.replace(/\.json$/, '')))
    .filter((s): s is Site => s !== null)
    .map(({ id, name }) => ({ id, name }))
}

/** 최신순 */
export function listRevisions(siteId: string): Revision[] {
  return [...(readJson<Revision[]>(revFile(siteId)) ?? [])].reverse()
}

function addRevision(rev: Omit<Revision, 'id' | 'createdAt'>): Revision {
  const full: Revision = {
    ...rev,
    id: `rev_${randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  }
  const all = readJson<Revision[]>(revFile(rev.siteId)) ?? []
  all.push(full)
  writeJson(revFile(rev.siteId), all)
  return full
}

/** 스키마 변경의 단일 창구: 검증 → 저장 → 리비전 기록 */
export function commitOps(siteId: string, ops: Op[], author: Revision['author'], summary: string) {
  const current = getSite(siteId)
  if (!current) throw new Error('사이트를 찾을 수 없어')
  const next = applyOps(current, ops)
  saveSite(next)
  const revision = addRevision({ siteId, snapshot: current, ops, author, summary })
  return { site: next, revision }
}

/** 해당 리비전을 적용하기 전 상태로 복원한다. 히스토리는 지우지 않고 새 리비전을 남긴다. */
export function restoreRevision(siteId: string, revisionId: string) {
  const current = getSite(siteId)
  const target = listRevisions(siteId).find((r) => r.id === revisionId)
  if (!current || !target) throw new Error('리비전을 찾을 수 없어')
  saveSite(target.snapshot)
  const revision = addRevision({
    siteId,
    snapshot: current,
    ops: [],
    author: 'user',
    summary: `되돌리기: ${target.summary}`,
  })
  return { site: target.snapshot, revision }
}
