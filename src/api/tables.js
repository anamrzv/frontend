import axios from './axios'

// Get all tables
export const getTablesList = () => {
  return axios.get('/tables')
}

// Get table schema
export const getTableSchema = (schema, tableName) => {
  return axios.get(`/tables/${schema}/${tableName}`)
}

// Get table metadata
export const getTableMetadata = (tableName) => {
  return axios.get(`/tables/${tableName}/metadata`)
}

// Get table data with pagination
export const getTableData = (schema, tableName, params) => {
  return axios.get(`/data/${schema}/${tableName}`, { params })
}

// Get single row
export const getRowById = (tableName, id) => {
  return axios.get(`/data/${tableName}/${id}`)
}

// Create new row
export const createRow = (schema, tableName, data) => {
  return axios.post(`/data/${schema}/${tableName}`, data)
}

// Update row
export const updateRow = (schema, tableName, id, data) => {
  return axios.put(`/data/${schema}/${tableName}/${id}`, data)
}

// Delete row
export const deleteRow = (schema, tableName, id) => {
  return axios.delete(`/data/${schema}/${tableName}/${id}`)
}

// Bulk create
export const bulkCreate = (schema, tableName, rows) => {
  return axios.post(`/data/${schema}/${tableName}/bulk`, { rows })
}
