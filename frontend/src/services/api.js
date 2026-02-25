import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const unwrapList = (responseData) => {
  if (Array.isArray(responseData)) return responseData
  if (Array.isArray(responseData?.datos)) return responseData.datos
  return []
}

const createService = (resource) => ({
  getAll: () => api.get(`/${resource}/`),
  getById: (id) => api.get(`/${resource}/${id}`),
  create: (data) => api.post(`/${resource}/`, data),
  update: (id, data) => api.put(`/${resource}/${id}`, data),
  delete: (id) => api.delete(`/${resource}/${id}`)
})

export const cuidadorService = createService('cuidadores')
export const pacienteService = createService('pacientes')
export const guardiaService = createService('guardias')
export const pagoService = createService('pagos')
export const usuarioService = createService('usuarios')

export const authService = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  changePassword: (data) => api.put('/auth/cambiar-password', data)
}

export const reporteService = {
  getResumen: () => api.get('/reportes/resumen'),
  getCuidadores: () => api.get('/reportes/cuidadores'),
  getPagos: () => api.get('/reportes/pagos'),
  getGuardiasPorFecha: (desde, hasta) => api.get('/reportes/guardias', { params: { desde, hasta } })
}

export const documentoService = {
  getByCuidador: (cuidadorId) => api.get(`/documentos/cuidador/${cuidadorId}`),
  upload: (cuidadorId, formData) => api.post(`/documentos/cuidador/${cuidadorId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/documentos/${id}`)
}

export { unwrapList }

export default api
