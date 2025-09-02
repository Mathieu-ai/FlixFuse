import * as v from 'valibot'

export function useValidation<TOut>() {
  const errors = ref<Record<string, string>>({})

  function reset() { errors.value = {} }

  function validate(schema: v.BaseSchema<unknown, TOut, v.BaseIssue<unknown>>, data: unknown): { ok: true; value: TOut } | { ok: false; fieldErrors: Record<string, string> } {
    const res = v.safeParse(schema as v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>, data)
    if ((res as { success: boolean }).success) {
      reset()
      const value = (res as { output: TOut }).output
      return { ok: true, value }
    }
    const issues = (res as { issues?: Array<{ path?: Array<{ key?: string } | string>; message?: string }> }).issues || []
    const map: Record<string, string> = {}
    for (const issue of issues) {
      const p = (issue.path && issue.path[0])
      const key = typeof p === 'string' ? p : (p?.key || '')
      if (key) map[key] = issue.message || 'Invalid value'
    }
    errors.value = map
    return { ok: false, fieldErrors: map }
  }

  return { errors, validate, reset }
}
