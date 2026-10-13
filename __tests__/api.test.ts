import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { POST as createSite } from '@/app/api/sites/route'
import { POST as chat } from '@/app/api/sites/[id]/chat/route'
import { POST as ops } from '@/app/api/sites/[id]/ops/route'
import { GET as listRevs, POST as restore } from '@/app/api/sites/[id]/revisions/route'

let dir: string
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pagely-api-'))
  process.env.DATA_DIR = dir
})
afterEach(() => {
  delete process.env.DATA_DIR
  fs.rmSync(dir, { recursive: true, force: true })
})

const post = (body: unknown) =>
  new Request('http://x.test', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
const ctx = (id: string) => ({ params: Promise.resolve({ id }) })

describe('api', () => {
  it('아이디어 문장으로 초안을 만든다', async () => {
    const site = await (
      await createSite(post({ idea: '"달빛"이라는 모던한 카페 홈페이지' }))
    ).json()
    expect(site.name).toBe('달빛')
    expect(site.pages).toHaveLength(3)
  })

  it('빈 아이디어는 400', async () => {
    expect((await createSite(post({ idea: '  ' }))).status).toBe(400)
  })

  it('초안 생성 → 채팅 수정 → 되돌리기', async () => {
    const site = await (
      await createSite(post({ name: '은혜교회', industry: 'church', tone: 'warm' }))
    ).json()
    expect(site.pages).toHaveLength(3)

    const before = site.pages[0].sections[0].props.title
    const res = await (await chat(post({ message: '히어로 문구 더 짧게' }), ctx(site.id))).json()
    expect(res.changed).toBe(true)
    expect(res.site.pages[0].sections[0].props.title.length).toBeLessThan(before.length)

    const revs = await (await listRevs(new Request('http://x.test'), ctx(site.id))).json()
    expect(revs).toHaveLength(1)

    const back = await (await restore(post({ revisionId: revs[0].id }), ctx(site.id))).json()
    expect(back.site.pages[0].sections[0].props.title).toBe(before)
  })

  it('잘못된 입력은 400, 없는 사이트는 404', async () => {
    expect((await createSite(post({ name: '', industry: 'x', tone: 'y' }))).status).toBe(400)
    expect((await chat(post({ message: '안녕' }), ctx('nope'))).status).toBe(404)
    const site = await (
      await createSite(post({ name: 'A', industry: 'cafe', tone: 'modern' }))
    ).json()
    const bad = await ops(
      post({ ops: [{ op: 'update_section', route: '/', sectionId: 'zzz', props: {} }] }),
      ctx(site.id)
    )
    expect(bad.status).toBe(404)
  })
})
