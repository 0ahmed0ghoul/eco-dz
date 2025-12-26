import { useState } from 'react';

const tabs = ['Only Intrepid experiences', 'New trips', 'Popular trips'];

const experiences = [
  {
    title: 'Spill the chai with Shrishti',
    duration: '8 days',
    destination: "India's Golden Triangle",
    price: '$896',
    originalPrice: '$995',
    discount: 'Save $99',
    tag: 'Bestseller',
    image: '/assets/destinations/alhaggar.jpg',
  },
  {
    title: 'Springtime in the Maasai Mara',
    duration: '16 days',
    destination: 'Gorillas & Game Parks',
    price: '$4,530',
    image: '/assets/destinations/Atlas_Cedar_Forest_in_Mount_Chelia.jpg',
  },
  {
    title: 'Sail Naxos with Nikos',
    duration: '10 days',
    destination: 'Greece Sailing Adventure: Cyclades Islands',
    price: '$2,692',
    image: '/assets/destinations/Beni Salah Mountain.jpg',
  },
  {
    title: 'Sweet treats, Hanoi streets',
    duration: '10 days',
    destination: 'Vietnam Express Southbound',
    price: '$1,113',
    originalPrice: '$1,590',
    discount: 'Save $477',
    image: '/assets/destinations/bni_haroun.jpg',
  },
  {
    title: 'Tortuguero trails with Pedro',
    duration: '15 days',
    destination: 'Classic Costa Rica',
    price: '$1,999',
    originalPrice: '$2,660',
    discount: 'Save $661',
    image: '/assets/destinations/chrea.jpg',
  },
];

export default function IntrepidExperienceGallery() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section className="py-12 px-4 md:px-8 z-10">
      <div className="max-w-7xl mx-auto border-b pb-12 border-gray-200">
        {/* Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-0">
            Only Intrepid experiences
          </h2>
          
          {/* Tabs */}
          <div className="flex space-x-1 p-1 rounded-lg inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative h-16 flex items-center px-3 text-gray-800 font-medium hover:text-emerald-600 transition-colors
                after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-emerald-600 
                after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm">
          {experiences.map((exp, idx) => (
            <div
              key={idx}
              className="group rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {exp.tag && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white text-gray-900 text-xs font-semibold rounded-sm">
                      {exp.tag}
                    </span>
                  </div>
                )}
                
                {exp.discount && (
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-sm">
                      {exp.discount}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-sm text-white font-medium">
                      {exp.duration}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1 line-clamp-2">
                      {exp.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                  {exp.destination}
                </p>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300">From</span>
                    {exp.originalPrice ? (
                      <>
                        <span className="text-gray-300 text-sm line-through">
                          {exp.originalPrice}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {exp.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {exp.price}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Small group (max 16)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors duration-300">
            Explore experiences
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Best price guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Flexible booking</span>
            </div>
                        <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>CO₂ Offset Flights</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
