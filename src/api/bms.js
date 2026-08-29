import { requestOrMock } from './client'
import { getDefaultBmsDetail } from '@/mock/data'

export function fetchBmsDetail(cabinetId) {
  return requestOrMock(
    () => getDefaultBmsDetail(cabinetId),
    (http) => http.get(`/bms/${cabinetId}`)
  )
}
