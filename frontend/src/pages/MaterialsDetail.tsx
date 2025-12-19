import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Item } from '../types';
import { ItemType } from '../types';
import { ArrowLeft, Save, Plus, Trash2, Layers } from 'lucide-react';

export default function MaterialsDetail() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (code) {
      fetchItem(code);
    }
  }, [code]);

  const fetchItem = async (code: string) => {
    try {
      const res = await axios.get(`/api/materials/${code}`);
      setItem(res.data);
    } catch (err) {
      console.error(err);
      setError('Malzeme bilgileri yüklenemedi.');
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

  if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;
  if (error || !item) return <div className="p-8 text-center text-red-500">{error || 'Malzeme bulunamadı'}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/materials')}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{item.code}</h2>
            <p className="text-sm text-gray-500">{getItemTypeName(item.type)}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Save className="w-4 h-4" />
          Kaydet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Kolon: Genel Bilgiler */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900 border-b pb-2">Genel Bilgiler</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500">Stok (Elde)</label>
              <div className="mt-1 text-sm font-medium text-gray-900">{item.onHand}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Temin Süresi (Gün)</label>
              <div className="mt-1 text-sm font-medium text-gray-900">{item.leadTimeDays}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Emniyet Stoğu</label>
              <div className="mt-1 text-sm font-medium text-gray-900">{item.safetyStock}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Min. Sipariş Miktarı</label>
              <div className="mt-1 text-sm font-medium text-gray-900">{item.minOrderQty}</div>
            </div>
             <div>
              <label className="block text-xs font-medium text-gray-500">Ağaç Seviyesi (LLC)</label>
              <div className="mt-1 text-sm font-medium text-gray-900">{item.lowLevelCode}</div>
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Ürün Ağacı (BOM) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Ürün Reçetesi (BOM)
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              <Plus className="w-3 h-3" /> Bileşen Ekle
            </button>
          </div>

          {item.billOfMaterials && item.billOfMaterials.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bileşen Kodu</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Miktar</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Fire (%)</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Efektif Miktar</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {item.billOfMaterials.map((bom) => (
                    <tr key={bom.id}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{bom.childItemCode}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">{bom.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">{(bom.scrapRate * 100).toFixed(1)}%</td>
                       <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                        {(bom.quantity * (1 + bom.scrapRate)).toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">
              Bu malzeme için tanımlanmış bir reçete bulunmuyor.
              <br />
              (Hammadde olabilir veya henüz bileşen eklenmemiş)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
