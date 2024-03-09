
import { axios } from '@/utils/request'

export function check(data) {
  return axios({
    url: "/medicalShare/frontApply/pass",
    method: 'post',
    params: { id: data.id }
  })
}

export function reBack(data) {
  return axios({
    url: "/medicalShare/frontApply/reBack",
    method: 'post',
    params: { id: data.id ,reason: data.reason}
  })
}