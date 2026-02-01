import { apiFetch } from '@/services'

const API_ENDPOINT = '/api/settings'

async function execute(action, data = {}) {
  return await apiFetch(API_ENDPOINT, {
    method: 'POST',
    body: { action, data }
  })
}

export const settingService = {
  importJobs: (jobs) => execute('import_jobs', { jobs }),
  clearJobs: () => execute('clear_jobs'),
  exportJobs: () => execute('export_jobs'),
  getSchedulerConfig: () => execute('get_scheduler_config'),
  saveSchedulerConfig: (config) => execute('save_scheduler_config', config)
}