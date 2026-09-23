interface ErrorBannerProps {
  message: string
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <p className="error-banner" role="alert">
      {message}
    </p>
  )
}