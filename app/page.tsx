import PourSequence from "@/components/hero/PourSequence";
import Story from "@/components/sections/Story";
import Specs from "@/components/sections/Specs";
import Tasting from "@/components/sections/Tasting";
import Ingredients from "@/components/sections/Ingredients";
import Pairing from "@/components/sections/Pairing";
import Shop from "@/components/sections/Shop";
import Reviews from "@/components/sections/Reviews";
import Order from "@/components/sections/Order";

export default function Home() {
  return (
    <main id="contenido" className="flex-1">
      <PourSequence />

      <Story />
      <Specs />
      <Tasting />
      <Ingredients />
      <Pairing />
      <Shop />
      <Reviews />
      <Order />
    </main>
  );
}
