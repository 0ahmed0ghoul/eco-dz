import Tassili from '../assets/monuments/Tassili.avif'
import Alhaggar from '../assets/monuments/Alhaggar.jpg'
import tahat from '../assets/monuments/tahat.jfif'
import chrea from '../assets/monuments/chrea.jpg'


export const monuments = [
    {
      id: 1,
      name: "Tassili n'Ajjer National Park",
      category: "desert",
      lat: 25.3,
      lng: 8.2,
      image: Tassili,
      description: "A UNESCO World Heritage Site known for its prehistoric rock art and stunning sandstone formations.",
    },
  
    {
      id: 2,
      name: "Hoggar Mountains (Ahaggar)",
      category: "mountain",
      lat: 23.3,
      lng: 5.7,
      image: Alhaggar,
      description: "A massive volcanic mountain range in southern Algeria, home to Mount Tahat, the country's highest peak.",
    },
  
    {
      id: 3,
      name: "Mount Tahat",
      category: "mountain",
      lat: 23.29,
      lng: 5.54,
      image: tahat,
      description: "The highest point in Algeria at 2,908 meters, located in the Hoggar range.",
    },
  
    {
      id: 4,
      name: "Chréa National Park",
      category: "forest",
      lat: 36.48,
      lng: 3.92,
      image: chrea,
      description: "A lush national park in the Blida Atlas, home to cedar forests and the endangered Barbary macaque.",
    },
  
    // {
    //   id: 5,
    //   name: "Djurdjura National Park",
    //   category: "mountain",
    //   lat: 36.41,
    //   lng: 4.08,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/5/54/Djurdjura_Mountains.jpg",
    //   description: "A spectacular mountain range with deep valleys, cliffs, and rich biodiversity.",
    // },
  
    // {
    //   id: 6,
    //   name: "Taza National Park",
    //   category: "forest",
    //   lat: 36.83,
    //   lng: 5.43,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Taza_national_park.jpg",
    //   description: "One of Algeria’s richest biodiversity hotspots, located in Jijel with rare flora and fauna.",
    // },
  
    // {
    //   id: 7,
    //   name: "Gouraya National Park",
    //   category: "coastal",
    //   lat: 36.78,
    //   lng: 5.06,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Gouraya_djurdjura.jpg",
    //   description: "A coastal national park in Béjaïa featuring cliffs, beaches, and the famous Cape Carbon.",
    // },
  
    // {
    //   id: 8,
    //   name: "El Kala National Park",
    //   category: "forest",
    //   lat: 36.89,
    //   lng: 8.43,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/8/80/El_Kala_lake.jpg",
    //   description: "Declared a UNESCO Biosphere Reserve, known for its lakes, wetlands, and rich wildlife.",
    // },
  
    // {
    //   id: 9,
    //   name: "Tikjda",
    //   category: "mountain",
    //   lat: 36.45,
    //   lng: 4.17,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Tikjda_snow.jpg",
    //   description: "A popular mountain resort located within Djurdjura, known for snow, forests, and hiking trails.",
    // },
  
    // {
    //   id: 10,
    //   name: "Cape Carbon",
    //   category: "coastal",
    //   lat: 36.78,
    //   lng: 5.09,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Cap_Carbon.jpg",
    //   description: "Home of the highest lighthouse in the Mediterranean, located on a breathtaking cliff.",
    // },
  
    // {
    //   id: 11,
    //   name: "The Sahara Dunes of Tindouf",
    //   category: "desert",
    //   lat: 27.67,
    //   lng: -8.13,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/7/71/Sahara_desert.jpg",
    //   description: "Vast golden dunes offering some of the purest desert landscapes in Algeria.",
    // },
  
    // {
    //   id: 12,
    //   name: "Erg Chech",
    //   category: "desert",
    //   lat: 26.0,
    //   lng: -1.0,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Erg_Chech.jpg",
    //   description: "A massive, remote sand sea located on the southwestern Algerian border.",
    // },
  
    // {
    //   id: 13,
    //   name: "M'zab Valley",
    //   category: "desert",
    //   lat: 32.49,
    //   lng: 3.67,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/5/54/M%27zab_valley.jpg",
    //   description: "A UNESCO-listed region known for its unique Saharan architecture and palm groves.",
    // },
  
    // {
    //   id: 14,
    //   name: "Ghoufi Canyon",
    //   category: "mountain",
    //   lat: 35.0,
    //   lng: 6.37,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Ghoufi_canyon.jpg",
    //   description: "A deep canyon with ancient troglodyte dwellings carved into the cliffs.",
    // },
  
    // {
    //   id: 15,
    //   name: "Béni Add Caves (Aïn Fezza)",
    //   category: "mountain",
    //   lat: 34.88,
    //   lng: -1.38,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Beni_Add_caves.jpg",
    //   description: "A stunning network of underground caves full of stalactites and stalagmites.",
    // },
  
    // {
    //   id: 16,
    //   name: "Lake Tonga",
    //   category: "coastal",
    //   lat: 36.92,
    //   lng: 8.53,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Lac_Tonga.jpg",
    //   description: "One of Algeria’s most important wetlands, home to migratory birds and rare species.",
    // },
  
    // {
    //   id: 17,
    //   name: "Lake Oubeira",
    //   category: "forest",
    //   lat: 36.87,
    //   lng: 8.41,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Lac_Oubeira_el_kala.jpg",
    //   description: "A freshwater lake inside El Kala biosphere reserve, surrounded by pristine forests.",
    // },
  
    // {
    //   id: 18,
    //   name: "Zeribet El Oued Salt Lake",
    //   category: "desert",
    //   lat: 34.7,
    //   lng: 6.75,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/1/18/Chott_Salt_Lake.jpg",
    //   description: "A spectacular chott (salt flat) that changes colors depending on season and light.",
    // },
  
    // {
    //   id: 19,
    //   name: "Chelia Mountain",
    //   category: "mountain",
    //   lat: 35.28,
    //   lng: 6.65,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Mount_Chelia.jpg",
    //   description: "The highest mountain in the Aurès region, offering dramatic landscapes and forests.",
    // },
  
    // {
    //   id: 20,
    //   name: "Babor Mountain",
    //   category: "forest",
    //   lat: 36.49,
    //   lng: 5.63,
    //   image: "https://upload.wikimedia.org/wikipedia/commons/7/79/Mount_Babor.jpg",
    //   description: "A highly biodiverse mountain home to the endangered Barbary Macaque and unique flora.",
    // },
    // {
    //   id: 21,
    //   name: "Mergueb Nature Reserve",
    //   category: "steppe",
    //   lat: 35.45,
    //   lng: 4.08,
    //   image: "...",
    //   description: "A large steppe reserve protecting endangered gazelles and desert fauna."
    // },
    // {
    //   id: 22,
    //   name: "Hammam Melouane Valley",
    //   category: "valley",
    //   lat: 36.47,
    //   lng: 3.28,
    //   image: "...",
    //   description: "A green valley with thermal waters, dense forests, and mountain streams."
    // },
    // {
    //   id: 23,
    //   name: "Beni Salah Mountain",
    //   category: "mountain",
    //   lat: 36.49,
    //   lng: 7.62,
    //   image: "...",
    //   description: "A large forested mountain near El Tarf known for its panoramic views and wildlife."
    // },
    // {
    //   id: 24,
    //   name: "Zahlane Caves (Djebel Taya)",
    //   category: "cave",
    //   lat: 36.34,
    //   lng: 6.62,
    //   image: "...",
    //   description: "A long chain of underground limestone caves with unique geological formations."
    // },
    // {
    //   id: 25,
    //   name: "Chelia Mountain (Aures)",
    //   category: "mountain",
    //   lat: 35.3,
    //   lng: 6.63,
    //   image: "...",
    //   description: "The highest peak in the Aurès mountains with cedar forests and stunning horizons."
    // },
    // {
    //   id: 27,
    //   name: "Mezaïa Cedar Forest",
    //   category: "forest",
    //   lat: 35.96,
    //   lng: 4.24,
    //   image: "...",
    //   description: "A cedar-rich forest region in the Tell Atlas, known for its biodiversity."
    // },
    // {
    //   id: 28,
    //   name: "Sidi Fredj Coast",
    //   category: "coast",
    //   lat: 36.74,
    //   lng: 2.83,
    //   image: "...",
    //   description: "Beautiful coastline mixing history and Mediterranean ecology."
    // },
    // {
    //   id: 29,
    //   name: "Oubeira Lake",
    //   category: "lake",
    //   lat: 36.85,
    //   lng: 8.38,
    //   image: "...",
    //   description: "A freshwater lake in El Kala Park, home to migratory birds and wetland species."
    // },
    // {
    //   id: 30,
    //   name: "Beni Haroun Dam & Lake",
    //   category: "lake",
    //   lat: 36.43,
    //   lng: 6.33,
    //   image: "...",
    //   description: "The largest dam reservoir in Algeria, surrounded by forests and hills."
    // }
  ];
  