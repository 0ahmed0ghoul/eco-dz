import { useEffect, useState } from "react";

export default function GreenTransport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/green-transport")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mt-8 mb-4">
        Green Transportation Options
      </h2>
      {data.map(t => (
        <div key={t.id} className="mb-4">
          <img src={t.image} alt={t.type} className="h-40 w-full object-cover" />
          <h3 className="font-bold mt-2">{t.type}</h3>
          <p className="text-gray-600 text-sm">{t.description}</p>
        </div>
      ))}
    </>
  );
}
