import request from '@/utils/umi-request';

export async function fakeSubmitForm(params: any) {
  return request('/web/schoolWebsiteConfig', {
    method: 'POST',
    data: params,
  });
}
