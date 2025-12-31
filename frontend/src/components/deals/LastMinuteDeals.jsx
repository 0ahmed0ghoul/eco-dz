import { useEffect, useState } from "react";

export default function LastMinuteDeals() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/deals/last-minute")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Last Minute Deals</h2>
      {data.map(d => (
        <div key={d.id}>
          <h3>{d.title} (-{d.discount}%)</h3>
          <p>{d.description}</p>
        </div>
      ))}
    </>
  );
}
