import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSchemaStore = defineStore('schema', () => {
  const selectedSchema = ref('public')

  const setSchema = (schema) => {
    selectedSchema.value = schema
  }

  return {
    selectedSchema,
    setSchema
  }
})
