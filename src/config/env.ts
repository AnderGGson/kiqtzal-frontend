const env = {
  apiBaseUrl:
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api',
  publicUrl: (import.meta.env.VITE_PUBLIC_URL as string | undefined) ?? undefined,
}

export default env