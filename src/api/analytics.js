import axios from './axios'

// Get aggregated data
export const getAggregatedData = (params) => {
  return axios.post('/analytics/aggregate', params)
}

// Get chart data
export const getChartData = (params) => {
  return axios.post('/analytics/chart', params)
}

// Execute custom query
export const executeCustomQuery = (query) => {
  return axios.post('/analytics/query', { query })
}

// Get table statistics
export const getTableStatistics = (tableName) => {
  return axios.get(`/analytics/${tableName}/stats`)
}
