import { ZodError } from 'zod'

export type RouteCtx = { params: Promise<{ id: string }> }

/** Route Handler 공통 에러 처리: 검증 실패 400, 그 외 실패 404/500 */
export async function handle(fn: () => Promise<unknown> | unknown): Promise<Response> {
  try {
    return Response.json(await fn())
  } catch (e) {
    if (e instanceof ZodError) {
      return Response.json({ error: '입력이 올바르지 않아', issues: e.issues }, { status: 400 })
    }
    const message = e instanceof Error ? e.message : '알 수 없는 오류'
    const status = message.includes('찾을 수 없') ? 404 : message === '잘못된 id' ? 400 : 500
    return Response.json({ error: message }, { status })
  }
}
