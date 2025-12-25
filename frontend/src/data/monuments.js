
import Tassili from "../assets/destinations/Tassili.avif";
import tahat from "../assets/destinations/tahat.jfif";
import Alhaggar from "../assets/destinations/Alhaggar.jpg";
import chrea from "../assets/destinations/chrea.jpg";
import Chelia from "../assets/destinations/Chelia_2.jpg";
import SidiFredj from "../assets/destinations/Sidi Fredj Coast1.webp";
import Zahlane from "../assets/destinations/Zahlane Caves (Djebel Taya).jpg";
import LacOubeira from "../assets/destinations/Lac_Oubeira,_Parc_National_d_El-Kala_El-Tarf.jpg";
import BniHaroun from "../assets/destinations/bni_haroun.jpg";

export const monuments = [
  {
    id: 1,
    name: "Tassili n'Ajjer National Park",
    category: "desert",
    destination: "Illizi – Algeria",
    image: Tassili,
    description:
      "A UNESCO World Heritage Site with surreal sandstone formations and prehistoric rock art.",
    durationDays: 7,
    price: 1800,
    physicalRating: 4.5,
  },
  {
    id: 2,
    name: "Hoggar Mountains (Ahaggar)",
    category: "mountain",
    destination: "Tamanrasset – Algeria",
    image: Alhaggar,
    description:
      "Volcanic mountains, Tuareg culture, and unforgettable desert skies.",
    durationDays: 10,
    price: 2200,
    physicalRating: 5,
  },
  {
    id: 3,
    name: "Mount Tahat",
    category: "mountain",
    destination: "Hoggar – Algeria",
    image: tahat,
    description:
      "Algeria’s highest peak with breathtaking Sahara views.",
    durationDays: 5,
    price: 1500,
    physicalRating: 5,
  },
  {
    id: 4,
    name: "Chréa National Park",
    category: "forest",
    destination: "Blida – Algeria",
    image: chrea,
    description:
      "Cedar forests, fresh air, and mountain wildlife.",
    durationDays: 2,
    price: 350,
    physicalRating: 2,
  },
  {
    id: 5,
    name: "Gouraya National Park",
    category: "coastal",
    destination: "Béjaïa – Algeria",
    image: Chelia,
    description:
      "Cliffs, beaches, and Mediterranean views.",
    durationDays: 3,
    price: 600,
    physicalRating: 2.5,
  },
  {
    id: 6,
    name: "Cape Carbon",
    category: "coastal",
    destination: "Béjaïa – Algeria",
    image: SidiFredj,
    description:
      "Home to Africa’s highest lighthouse.",
    durationDays: 1,
    price: 200,
    physicalRating: 1.5,
  },
  {
    id: 7,
    name: "Béni Add Caves",
    category: "cave",
    destination: "Tlemcen – Algeria",
    image: Zahlane,
    description:
      "Underground limestone wonders.",
    durationDays: 1,
    price: 250,
    physicalRating: 2.5,
  },
  {
    id: 8,
    name: "Lake Oubeira",
    category: "lake",
    destination: "El Kala – Algeria",
    image: LacOubeira,
    description:
      "Peaceful lake inside a biosphere reserve.",
    durationDays: 2,
    price: 400,
    physicalRating: 1.5,
  },
  {
    id: 9,
    name: "Beni Haroun Dam",
    category: "lake",
    destination: "Mila – Algeria",
    image: BniHaroun,
    description:
      "Algeria’s largest dam reservoir.",
    durationDays: 2,
    price: 450,
    physicalRating: 1,
  },
];
