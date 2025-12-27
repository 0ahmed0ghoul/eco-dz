import { useEffect, useState } from "react";

export default function EcoTours() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/eco-tours")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Eco-Friendly Tours</h2>
      {data.map(t => (
        <div key={t.id} className="mb-4">
          <img src={t.image} className="h-40 w-full object-cover" />
          <h3>{t.title}</h3>
          <p>{t.description}</p>
        </div>
      ))}
    </>
  );
}
