import { useEffect, useState } from "react";

export default function DealDestinations() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/deals/destinations")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mt-8 mb-4">All Destinations</h2>
      {data.map(d => (
        <div key={d.id}>
          <h3>{d.name}</h3>
          <p>{d.description}</p>
        </div>
      ))}
    </>
  );
}
