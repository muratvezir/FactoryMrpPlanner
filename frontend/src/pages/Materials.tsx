import { useEffect, useState } from 'react';
import axios from 'axios';
import { Item, ItemType } from '../types';
import { Plus, Search, Filter } from 'lucide-react';

export default function Materials() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const res = await axios.get('/api/materials');
      setItems(res.data);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getItemTypeName = (type: number) => {
    switch(type) {
      case ItemType.RawMaterial: return 'Hammadde';
      case ItemType.WorkInProgress: return 'Yarı Mamul';
      case ItemType.FinishedGood: return 'Mamul';
      default: return 'Bilinmiyor';
    }
  };

  const getItemTypeBadgeColor = (type: number) => {
    switch(type) {
      case ItemType.RawMaterial: return 'bg-gray-100 text-gray-800';
      case ItemType.WorkInProgress: return 'bg-yellow-100 text-yellow-800';
      case ItemType.FinishedGood: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Malzemeler</h2>
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          <Plus className="h-4 w-4" />
          Yeni Malzeme
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Kod veya isim ile ara..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
            <Filter className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kod</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Temin (Gün)</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Min Sipariş</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Yükleniyor...</td>
                    </tr>
                ) : items.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">Kayıt bulunamadı.</td>
                    </tr>
                ) : (
                    items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getItemTypeBadgeColor(item.type)}`}>
                                {getItemTypeName(item.type)}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{item.onHand}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{item.leadTimeDays}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">{item.minOrderQty}</td>
                    </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
