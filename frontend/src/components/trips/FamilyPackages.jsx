import { useEffect, useState } from "react";

export default function FamilyPackages() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/deals/family")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mt-8 mb-4">Family Packages</h2>
      {data.map(p => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
        </div>
      ))}
    </>
  );
}
