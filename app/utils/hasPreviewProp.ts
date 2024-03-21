import DynamicRouteProps from '../types/DynamicRouteProps';

export function hasPreviewProps<T extends string>(props: DynamicRouteProps<T>) {
  return props?.searchParams?.preview === 'true' && !!props?.searchParams?.p;
}
