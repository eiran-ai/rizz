const DEFAULT_PHONE = '250790459292'

export function usePhone(): string {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('phone')?.trim().replace(/^\+/, '') || DEFAULT_PHONE
  return raw
}
