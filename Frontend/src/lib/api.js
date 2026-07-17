import axios from 'axios'

// The backend auths via an httpOnly cookie, so every request needs credentials.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
})

// Small helper so callers can write `err.message` and get something readable
// regardless of whether the backend sent { message } or { error }.
export function apiErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  return err?.response?.data?.message || err?.response?.data?.error || fallback
}

/* ---------------------------- Auth ---------------------------- */
export const authApi = {
  register: (data) => api.post('/auth/register', data), // { name?, email, password }
  verifyEmail: (data) => api.post('/auth/email', data), // { email, otp }
  login: (data) => api.post('/auth/login', data), // { email, password }
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

/* --------------------------- Courses --------------------------- */
export const courseApi = {
  list: () => api.get('/course/'),
  lessons: (courseId) => api.get(`/course/lessons/${courseId}`),
}

/* -------------------------- Instructor -------------------------- */
export const instructorApi = {
  register: () => api.post('/instructor/register'),
  myCourses: () => api.get('/instructor/courses'),
  uploadCourse: (formData) =>
    api.post('/instructor/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  lessons: (courseId) => api.get(`/instructor/lessons/${courseId}`),
  uploadLesson: (courseId, formData) =>
    api.post(`/instructor/uploadLesson/${courseId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

/* ----------------------------- Cart ----------------------------- */
export const cartApi = {
  get: () => api.get('/cart/cart'),
  add: (courseId) => api.post(`/cart/addcart/${courseId}`),
  remove: (courseId) => api.delete(`/cart/deleteitems/${courseId}`),
  clear: () => api.delete('/cart/deleteallitems'),
}

/* --------------------------- Payment ---------------------------- */
export const paymentApi = {
  createOrder: () => api.post('/payment/createorder'),
  verifyOrder: (data) => api.post('/payment/verifyorder', data),
}

/* -------------------------- Enrollment -------------------------- */
export const enrollmentApi = {
  enroll: () => api.post('/enrollment/enroll'),
  myCourses: () => api.get('/enrollment/mycourses'),
}
