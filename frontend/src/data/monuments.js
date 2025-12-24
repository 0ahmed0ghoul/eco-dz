import Tassili from '../assets/destinations/Tassili.avif'
import Alhaggar from '../assets/destinations/Alhaggar.jpg'
import tahat from '../assets/destinations/tahat.jfif'
import chrea from '../assets/destinations/chrea.jpg'
import Chelia from '../assets/destinations/Chelia_2.jpg'
import BeniSalah from '../assets/destinations/Beni Salah Mountain.jpg'
import Zahlane from '../assets/destinations/Zahlane Caves (Djebel Taya).jpg'
import LacOubeira from '../assets/destinations/Lac_Oubeira,_Parc_National_d_El-Kala_El-Tarf.jpg'
import SidiFredj from '../assets/destinations/Sidi Fredj Coast1.webp'
import BniHaroun from '../assets/destinations/bni_haroun.jpg'
import AtlasCedar from '../assets/destinations/Atlas_Cedar_Forest_in_Mount_Chelia.jpg'
import HammamMeskhoutine from '../assets/destinations/Hammam_Meskhoutine_vue_générale_1.webp'
import PaysageChelia from '../assets/destinations/Paysage_dans_le_parc_national_de_chelia_1.jpg'

export const monuments = [
  {
    id: 1,
    name: "Tassili n'Ajjer National Park",
    category: "desert",
    destination: "Illizi – Algeria",
    lat: 25.3,
    lng: 8.2,
    image: Tassili,
    description: "A UNESCO World Heritage Site known for its prehistoric rock art and sandstone formations.",
    durationDays: 7,
    price: 1800,
    physicalRating: 4.5,
    bestSeason: "October – March",
    activities: ["Hiking", "Desert trekking", "Photography"],
    travelType: "Desert Expedition",
  },

  {
    id: 2,
    name: "Hoggar Mountains (Ahaggar)",
    category: "mountain",
    destination: "Tamanrasset – Algeria",
    lat: 23.3,
    lng: 5.7,
    image: Alhaggar,
    description: "Volcanic mountain range home to Mount Tahat.",
    durationDays: 10,
    price: 2200,
    physicalRating: 5,
    bestSeason: "November – February",
    activities: ["Mountain hiking", "Camping", "Stargazing"],
    travelType: "Mountain Adventure",
  },

  {
    id: 3,
    name: "Mount Tahat",
    category: "mountain",
    destination: "Hoggar – Algeria",
    lat: 23.29,
    lng: 5.54,
    image: tahat,
    description: "The highest peak in Algeria at 2,908 meters.",
    durationDays: 5,
    price: 1500,
    physicalRating: 5,
    bestSeason: "November – February",
    activities: ["Summit climbing", "Hiking"],
    travelType: "High-Altitude Trek",
  },

  {
    id: 4,
    name: "Chréa National Park",
    category: "forest",
    destination: "Blida – Algeria",
    lat: 36.48,
    lng: 3.92,
    image: chrea,
    description: "A lush park famous for cedar forests and wildlife.",
    durationDays: 2,
    price: 350,
    physicalRating: 2,
    bestSeason: "Spring – Autumn",
    activities: ["Forest walks", "Picnic", "Wildlife watching"],
    travelType: "Nature Escape",
  },

  {
    id: 7,
    name: "Gouraya National Park",
    category: "coastal",
    destination: "Béjaïa – Algeria",
    lat: 36.78,
    lng: 5.06,
    image: Chelia,
    description: "Coastal cliffs, beaches, and Cape Carbon.",
    durationDays: 3,
    price: 600,
    physicalRating: 2.5,
    bestSeason: "April – September",
    activities: ["Hiking", "Swimming", "Photography"],
    travelType: "Coastal Nature Tour",
  },

  {
    id: 10,
    name: "Cape Carbon",
    category: "coastal",
    destination: "Béjaïa – Algeria",
    lat: 36.78,
    lng: 5.09,
    image: SidiFredj,
    description: "Mediterranean’s highest lighthouse on dramatic cliffs.",
    durationDays: 1,
    price: 200,
    physicalRating: 1.5,
    bestSeason: "All year",
    activities: ["Sightseeing", "Photography"],
    travelType: "Day Trip",
  },

  {
    id: 15,
    name: "Béni Add Caves (Aïn Fezza)",
    category: "cave",
    destination: "Tlemcen – Algeria",
    lat: 34.88,
    lng: -1.38,
    image: Zahlane,
    description: "Stunning underground limestone caves.",
    durationDays: 1,
    price: 250,
    physicalRating: 2.5,
    bestSeason: "All year",
    activities: ["Cave exploration", "Geology tour"],
    travelType: "Cave Exploration",
  },

  {
    id: 17,
    name: "Lake Oubeira",
    category: "lake",
    destination: "El Kala – Algeria",
    lat: 36.87,
    lng: 8.41,
    image: LacOubeira,
    description: "Freshwater lake inside El Kala biosphere.",
    durationDays: 2,
    price: 400,
    physicalRating: 1.5,
    bestSeason: "Spring – Summer",
    activities: ["Bird watching", "Kayaking", "Relaxation"],
    travelType: "Eco Lake Tour",
  },

  {
    id: 30,
    name: "Beni Haroun Dam & Lake",
    category: "lake",
    destination: "Mila – Algeria",
    lat: 36.43,
    lng: 6.33,
    image: BniHaroun,
    description: "Largest dam reservoir in Algeria.",
    durationDays: 2,
    price: 450,
    physicalRating: 1,
    bestSeason: "Spring – Autumn",
    activities: ["Sightseeing", "Photography"],
    travelType: "Lake & Dam Visit",
  },
]
