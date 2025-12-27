import LastMinuteDeals from "../components/LastMinuteDeals";
import FamilyPackages from "../components/FamilyPackages";
import AdventureTours from "../components/AdventureTours";
import DealDestinations from "../components/DealDestinations";

export default function Deals() {
  return (
    <div className="grid md:grid-cols-2 gap-10 p-8">
      <div className="space-y-6 text-lg font-medium">
        <p>Last Minute Deals</p>
        <p>Family Packages</p>
        <p>Adventure Tours</p>
        <p>All Destinations</p>
      </div>

      <div>
        <LastMinuteDeals />
        <FamilyPackages />
        <AdventureTours />
        <DealDestinations />
      </div>
    </div>
  );
}
