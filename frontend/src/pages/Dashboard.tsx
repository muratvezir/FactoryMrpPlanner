import { Activity, Package, AlertTriangle, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { name: 'Toplam Malzeme', value: '1,234', icon: Package, change: '+12%', changeType: 'positive' },
    { name: 'Kritik Stok', value: '23', icon: AlertTriangle, change: '-5%', changeType: 'positive' },
    { name: 'Aktif Siparişler', value: '45', icon: Activity, change: '+2%', changeType: 'neutral' },
    { name: 'Aylık Üretim', value: '89%', icon: TrendingUp, change: '+4.5%', changeType: 'positive' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white overflow-hidden rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-50">
                  <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">{item.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900">Son Aktiviteler</h3>
        <div className="mt-6 flow-root">
          <ul role="list" className="-my-5 divide-y divide-gray-200">
            <li className="py-5">
              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                <h3 className="text-sm font-semibold text-gray-800">
                  <span className="absolute inset-0" aria-hidden="true" />
                  MRP Hesaplaması Tamamlandı
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  Haftalık planlama döngüsü başarıyla tamamlandı. 12 yeni üretim emri oluşturuldu.
                </p>
              </div>
            </li>
            <li className="py-5">
              <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                <h3 className="text-sm font-semibold text-gray-800">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Stok Uyarısı: Vida M4
                </h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  Stok seviyesi kritik eşiğin altına düştü (Mevcut: 150, Kritik: 200).
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
