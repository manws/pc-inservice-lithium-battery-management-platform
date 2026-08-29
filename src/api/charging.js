import { requestOrMock } from './client'
import { chargingOverview } from '@/mock/data'

export function fetchChargingOverview() {
  return requestOrMock(chargingOverview, (http) => http.get('/charging/overview'))
}
