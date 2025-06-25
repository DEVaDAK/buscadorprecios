
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";

export default function BuscadorPrecios() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtrados, setFiltrados] = useState([]);

  const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUAvJ1dveudHEE_sOfQznvbDoxb_bIZ2oyotL5NiameLyhZZnj4J0ZQ8btEHgHqjyoFCrgMpdjqhFt/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    fetch(URL_CSV)
      .then(res => res.text())
      .then(text => {
        const data = Papa.parse(text, { header: true });
        setProductos(data.data);
      });
  }, []);

  useEffect(() => {
    const filtrados = productos.filter(p =>
      p["Código"]?.toLowerCase().includes(busqueda.toLowerCase())
    );
    setFiltrados(filtrados);
  }, [busqueda, productos]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Buscador de Precios</h1>
        <Input
          type="text"
          placeholder="Ingresá el código del producto"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="mb-6"
        />

        {filtrados.map((item, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="p-4">
              <p><strong>Código:</strong> {item["Código"]}</p>
              <p><strong>Descripción:</strong> {item["Descripción"]}</p>
              <p><strong>Precio Final:</strong> ${parseFloat(item["Precio Final"]).toFixed(2)}</p>
            </CardContent>
          </Card>
        ))}

        {busqueda && filtrados.length === 0 && (
          <p className="text-center text-gray-500">No se encontró ningún producto.</p>
        )}
      </div>
    </div>
  );
}
