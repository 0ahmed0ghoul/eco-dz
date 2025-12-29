import { useEffect, useState } from "react";

export default function Accommodations() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/accommodations")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mt-8 mb-4">
        Sustainable Accommodations
      </h2>
      {data.map(a => (
        <div key={a.id} className="mb-4">
          <img src={a.image} alt={a.name} className="h-40 w-full object-cover" />
          <h3 className="font-bold mt-2">{a.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{a.description}</p>
          <p className="text-gray-500 text-xs">{a.destination}</p>
        </div>
      ))}
    </>
  );
}
