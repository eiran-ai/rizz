const DEFAULT_NAME = 'Mystery Girl'

export function useName(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('name')?.trim() || DEFAULT_NAME
}
