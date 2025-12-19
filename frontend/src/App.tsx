import { useEffect, useState } from 'react'
import axios from 'axios'
import { Activity, Server, AlertCircle, CheckCircle2 } from 'lucide-react'

interface Material {
  id: number;
  code: string;
  name: string;
}

function App() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get('/api/materials')
      .then(res => {
        setMaterials(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('API bağlantısı başarısız. Backend çalışıyor mu?')
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Activity className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Factory MRP</h1>
            <p className="text-xs text-gray-500 font-medium">Vite + React + Tailwind v4</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <Server className="w-4 h-4" />
              Sistem Durumu
            </h2>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                API Bağlantısı Kontrol Ediliyor...
              </div>
            )}
            
            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded border border-red-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {!loading && !error && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded border border-green-100">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">Backend Bağlantısı Başarılı</span>
                </div>
                <p className="text-xs text-gray-500 ml-1">
                  Veritabanında <strong>{materials.length}</strong> adet malzeme kaydı bulundu.
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
