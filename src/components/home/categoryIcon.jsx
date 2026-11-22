import { PiBarbell, PiBaby, PiDress, PiHandbag, PiMoonStars, PiPersonSimpleSwim, PiSneaker, PiTShirt, PiCoatHanger } from "react-icons/pi";
import { TbJacket } from "react-icons/tb";

const ICONS = {
  shirt: PiTShirt,
  dress: PiDress,
  barbell: PiBarbell,
  jacket: TbJacket,
  baby: PiBaby,
  moon: PiMoonStars,
  swim: PiPersonSimpleSwim,
  shoe: PiSneaker,
  bag: PiHandbag,
};

export default function CategoryIcon({ name, className }) {
  const Icon = ICONS[name] ?? PiCoatHanger;
  return <Icon aria-hidden className={className} />;
}
