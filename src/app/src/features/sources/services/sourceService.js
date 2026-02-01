import { apiFetch } from '@/services'

const API_ENDPOINT = '/api/sources'

async function execute(action, data = {}) {
  return await apiFetch(API_ENDPOINT, {
    method: 'POST',
    body: { action, data }
  })
}

export const sourceService = {
  getAll: () => execute('get_sources'),
  create: (data) => execute('create_source', data),
  update: (id, data) => execute('update_source', { id, ...data }),
  delete: (id) => execute('delete_source', { id }),
  test: (data) => execute('test_source', data),
  testAll: () => execute('test_all_sources')
}