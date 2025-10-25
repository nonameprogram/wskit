export function isFunction(
    value: unknown
  ): value is (...args: unknown[]) => unknown {
    return (
      typeof value === 'function' ||
      value instanceof Function ||
      Object.prototype.toString.call(value) === '[object Function]'
    );
  }
  