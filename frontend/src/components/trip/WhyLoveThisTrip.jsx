import React from "react";

const highlights = [
  "Travel by camel across the dramatic red dunes of the Sahara and spend the night camping under North African stars.",
  "Spend some time in one of Morocco’s most picturesque towns, like the 11th-century kasbah of Ait Benhaddou, and participate in a painting class with a local artist.",
  "Rub shoulders with the locals in Todra Valley, Volubilis and Fes and gain a deeper understanding of sacred sites and the history and culture of Morocco with local and passionate guides.",
  "Have lunch at the Amal Association in Marrakech – a non-profit organisation empowering local women through employment on their journey towards financial independence.",
  "Prepare for the best mint tea of your life on a visit to the Tawesna teahouse. This experience is more than just a cuppa – it’s about discovering a culture, sharing a true moment and contributing to the economic inclusion of women.",
];

const WhyLoveThisTrip = () => {
  return (
    <section className="bg-white text-gray-800 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Why you'll love this trip</h2>
        <ul className="space-y-4 list-disc list-inside text-sm text-gray-700 leading-relaxed">
          {highlights.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WhyLoveThisTrip;
