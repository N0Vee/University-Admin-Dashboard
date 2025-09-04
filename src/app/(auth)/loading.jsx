export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-500">กำลังโหลด...</p>
      </div>
    </div>
  )
}
