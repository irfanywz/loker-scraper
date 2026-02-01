import { apiFetch } from '@/services'

const API_ENDPOINT = '/api/jobs'

async function execute(action, data = {}) {
  return await apiFetch(API_ENDPOINT, {
    method: 'POST',
    body: { action, data }
  })
}

export const jobService = {
  getAll: () => execute('get_jobs'),
  delete: (id) => execute('delete_job', { id }),
  scrape: () => execute('scrape_jobs')
}