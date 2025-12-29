import { useParams } from "react-router-dom";
import LastMinuteDeals from "../components/LastMinuteDeals";
import FamilyPackages from "../components/FamilyPackages";
import AdventureTours from "../components/AdventureTours";
import DealDestinations from "../components/DealDestinations";

export default function Deals() {
  const { type } = useParams();

  return (
    <div className="p-8">
      {(!type || type === "last-minute") && <LastMinuteDeals />}
      {(!type || type === "family") && <FamilyPackages />}
      {(!type || type === "adventure") && <AdventureTours />}
      {(!type || type === "destinations") && <DealDestinations />}
    </div>
  );
}
