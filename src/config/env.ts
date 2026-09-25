const env = {
  apiBaseUrl:
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    'https://kiqtzal-backend.vercel.app/api',
  publicUrl: (import.meta.env.VITE_PUBLIC_URL as string | undefined) ?? undefined,
}

export default env
