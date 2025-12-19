import { fetchMaterials } from "@/lib/api";
import { Item, ItemType } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MaterialsPage() {
    // SSR ile veri çekme
    let materials: Item[] = [];
    try {
        materials = await fetchMaterials();
    } catch (err) {
        console.error(err);
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Malzeme Yönetimi</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Stok Listesi</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kod</TableHead>
                                <TableHead>Tip</TableHead>
                                <TableHead className="text-right">Stok</TableHead>
                                <TableHead className="text-right">Temin (Gün)</TableHead>
                                <TableHead className="text-right">Min. Sipariş</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {materials.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">Kayıt bulunamadı veya sunucu hatası.</TableCell>
                                </TableRow>
                            ) : (
                                materials.map((item) => (
                                    <TableRow key={item.code}>
                                        <TableCell className="font-medium">{item.code}</TableCell>
                                        <TableCell>{ItemType[item.type]}</TableCell>
                                        <TableCell className="text-right">{item.onHand}</TableCell>
                                        <TableCell className="text-right">{item.leadTimeDays}</TableCell>
                                        <TableCell className="text-right">{item.minOrderQty}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
