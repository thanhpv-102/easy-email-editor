
export function classnames(...rest: any[]) {
  return rest.filter(item => typeof item === 'string' && item).join(' ');
}