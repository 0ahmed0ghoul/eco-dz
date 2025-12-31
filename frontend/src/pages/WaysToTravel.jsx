import EcoTours from "../components/trips/EcoTours";
import Accommodations from "../components/Accommodations";
import GreenTransport from "../components/trips/GreenTransport";

export default function WaysToTravel() {
  return (
    <div className="grid md:grid-cols-2 gap-10 p-8">
      <div className="space-y-6 text-lg font-medium">
        <p>Eco-Friendly Tours</p>
        <p>Sustainable Accommodations</p>
        <p>Green Transportation Options</p>
      </div>

      <div>
        <EcoTours />
        <Accommodations />
        <GreenTransport />
      </div>
    </div>
  );
}
