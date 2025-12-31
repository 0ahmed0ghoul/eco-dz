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
        <div key={t.id}>
          <h3>{t.type}</h3>
          <p>{t.description}</p>
        </div>
      ))}
    </>
  );
}
