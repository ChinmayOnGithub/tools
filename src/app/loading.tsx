

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <span className="sr-only">Loading page contents...</span>
    </div>
  );
}
