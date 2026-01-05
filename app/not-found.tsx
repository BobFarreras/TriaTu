// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <div className="max-w-md space-y-6">
        {/* Icona amigable (fantasma, lupa trencada, etc.) */}
        <div className="text-6xl">🙈</div>
        
        <h2 className="text-2xl font-bold text-gray-900">
          No hem trobat aquesta sala
        </h2>
        
        <p className="text-gray-600">
          És possible que l'enllaç sigui incorrecte, que la sala hagi estat eliminada, 
          o que no tinguis invitació per accedir-hi.
        </p>

        <div className="pt-4">
          <Link 
            href="/dashboard" // O la teva pàgina principal
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tornar a les meves sales
          </Link>
        </div>
      </div>
    </div>
  )
}