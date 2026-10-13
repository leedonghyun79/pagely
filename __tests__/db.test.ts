import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { commitOps, getSite, listRevisions, listSites, restoreRevision, saveSite } from '@/lib/db'
import { createDraft } from '@/lib/site/draft'

let dir: string
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'opennow-'))
  process.env.DATA_DIR = dir
})
afterEach(() => {
  delete process.env.DATA_DIR
  fs.rmSync(dir, { recursive: true, force: true })
})

describe('db', () => {
  it('저장/조회 왕복, 없는 id는 null', () => {
    const site = createDraft({ name: 'A', industry: 'cafe', tone: 'modern' })
    saveSite(site)
    expect(getSite(site.id)).toEqual(site)
    expect(getSite('nope')).toBeNull()
    expect(listSites()).toEqual([{ id: site.id, name: 'A' }])
  })

  it('commitOps는 리비전을 최신순으로 쌓고, restore로 되돌린다', () => {
    const site = createDraft({ name: 'A', industry: 'cafe', tone: 'modern' })
    saveSite(site)
    commitOps(site.id, [{ op: 'update_design_tokens', tokens: { primary: '#111111' } }], 'user', '색 변경')
    commitOps(site.id, [{ op: 'update_design_tokens', tokens: { primary: '#222222' } }], 'ai', '색 변경2')
    const revs = listRevisions(site.id)
    expect(revs.map((r) => r.summary)).toEqual(['색 변경2', '색 변경'])

    restoreRevision(site.id, revs[0].id)
    expect(getSite(site.id)?.tokens.primary).toBe('#111111')
    expect(listRevisions(site.id)).toHaveLength(3)
  })

  it('잘못된 id 문자는 거부한다', () => {
    expect(() => getSite('../etc')).toThrow()
  })
})
