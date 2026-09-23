import { httpClient } from './httpClient'
import type { ApiResult, Experiment, Measurement } from '../types'

export function fetchExperiments(): Promise<ApiResult<Experiment[]>> {
  return httpClient<Experiment[]>('/experiments')
}

export function fetchExperimentById(id: string): Promise<ApiResult<Experiment>> {
  return httpClient<Experiment>(`/experiments/${id}`)
}

export function fetchMeasurementsForExperiment(
  id: string,
  params?: { from?: string; to?: string; after?: string; limit?: number; offset?: number },
): Promise<ApiResult<Measurement[]>> {
  const query = buildQuery(params)
  return httpClient<Measurement[]>(`/experiments/${id}/measurements${query}`)
}

function buildQuery(params: Record<string, string | number | undefined> = {}): string {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, String(value)] as [string, string])
  const query = new URLSearchParams(entries).toString()
  return query ? `?${query}` : ''
}