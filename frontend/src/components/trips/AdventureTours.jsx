import { useEffect, useState } from "react";

export default function AdventureTours() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/deals/adventure")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mt-8 mb-4">Adventure Tours</h2>
      {data.map(a => (
        <div key={a.id}>
          <h3>{a.title} ({a.difficulty})</h3>
          <p>{a.description}</p>
        </div>
      ))}
    </>
  );
}
