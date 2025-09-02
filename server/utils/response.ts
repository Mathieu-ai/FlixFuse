import type { ApiResponse } from '../types/api'

export function createSuccessResponse<T>(data: T, meta?: ApiResponse<T>['meta']): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(meta && { meta })
  }
}

export function createErrorResponse(
  message: string,
  code?: string,
  details?: Record<string, unknown>
): ApiResponse<never> {
  return {
    success: false,
    error: {
      message,
      ...(code && { code }),
      ...(details && { details })
    }
  }
}

export function createValidationErrorResponse(errors: Array<{
  field: string
  message: string
  code: string
}>): ApiResponse<never> {
  return {
    success: false,
    error: {
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: { validationErrors: errors }
    }
  }
}
