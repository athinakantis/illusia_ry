import { BookingStatus } from '../types/types'

export const mapChipStatus = (status: BookingStatus) => {
  if (status === 'cancelled') return 'warning'
  else if (status === 'rejected') return 'error'
  return 'info'
}