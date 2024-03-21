'use server';

import { onLogin } from '@faustwp/experimental-app-router';

export async function loginAction<T>(
  _prevData: Awaited<T>,
  formData: FormData,
) {
  const res = await onLogin(formData);

  if (res.error) {
    return res;
  }

  return {};
}
