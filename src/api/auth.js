import { requestOrMock } from './client'

export function login(payload) {
  return requestOrMock(
    () => ({
      token: 'mock-token',
      username: payload.username
    }),
    (http) => http.post('/auth/login', payload)
  )
}

export function logout() {
  return requestOrMock(null, (http) => http.post('/auth/logout'))
}
