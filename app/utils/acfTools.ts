/**
 * Returns an array of objects given data from an ACF repeater/flex content field.
 *
 * ACF array fields can often be returned as null or arrays containing nulls. We
 * eliminate both worries.
 */
export function arrayFromAcf<T>(
  value: Array<T | null> | null | undefined,
): T[] {
  return isSomething(value) ? value.filter(isSomething) : [];
}

export function pickFromAcf<T, K extends keyof T>(
  arr: Array<T | null> | null | undefined,
  key: K,
) {
  return arrayFromAcf(arr)
    .map(el => el[key])
    .filter(isSomething);
}

export function isSomething<T>(value: T): value is NonNullable<T> {
  return !(value === null || typeof value === 'undefined');
}

type OmitNull<T> = T extends null ? Exclude<T, null> | undefined : T;

type OmitNullProps<T extends object> = { [Key in keyof T]: OmitNull<T[Key]> };

/**
 * Allow destructuring an object, turning any null properties into undefined so
 * a default can be given. If the given object may be null/undefined, then every
 * property may be undefined.
 *
 * Useful for assigning defaults for properties that may be null.
 */
export function withoutNulls<T extends object>(value: T): OmitNullProps<T>;
export function withoutNulls<T extends object>(
  value: T | null | undefined,
): Partial<OmitNullProps<T>>;
export function withoutNulls(value: unknown) {
  return Object.fromEntries(
    Object.entries(value || {}).filter(kv => kv[1] !== null),
  );
}

export function mapFromArray<T>(
  items: T[],
  indexProp: keyof T,
): Record<string, T>;
export function mapFromArray<T, VP extends keyof T>(
  items: T[],
  indexProp: keyof T,
  valueProp: VP,
): Record<string, T[VP]>;

export function mapFromArray<T, VP extends keyof T>(
  items: T[],
  indexProp: keyof T,
  valueProp?: VP,
) {
  if (typeof valueProp === 'undefined') {
    return items.reduce(
      (acc, curr) => {
        const key = curr[indexProp] as string;
        acc[key] = curr;
        return acc;
      },
      {} as Record<string, T>,
    );
  }

  return items.reduce(
    (acc, curr) => {
      const key = curr[indexProp] as string;
      const value = curr[valueProp];
      acc[key] = value;
      return acc;
    },
    {} as Record<string, T[VP]>,
  );
}
