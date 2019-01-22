import AcquisitionEvent from "./AcquisitionEvent";
import BuyoutEvent from "./BuyoutEvent";
import ControllingInterestPurchaseEvent from "./ControllingInterestPurchaseEvent";
import FormationEvent from "./FormationEvent";
import HiddenEvent from "./HiddenEvent";
import IncorporationEvent from "./IncorporationEvent";
import JointVentureEvent from "./JointVentureEvent";
import MergerEvent from "./MergerEvent";
import ReestablishmentEvent from "./ReestablishmentEvent";
import ReleaseEvent from "./ReleaseEvent";
import RenameEvent from "./RenameEvent";
import ShareDivestureEvent from "./ShareDivestureEvent";
import SpinoffEvent from "./SpinoffEvent";
import TransferEvent from "./TransferEvent";

const classes = {
  acquisition: AcquisitionEvent,
  buyout: BuyoutEvent,
  controllingInterestPurchase: ControllingInterestPurchaseEvent,
  formation: FormationEvent,
  hidden: HiddenEvent,
  incorporation: IncorporationEvent,
  jointVenture: JointVentureEvent,
  merger: MergerEvent,
  reestablishment: ReestablishmentEvent,
  release: ReleaseEvent,
  rename: RenameEvent,
  shareDivesture: ShareDivestureEvent,
  spinoff: SpinoffEvent,
  transfer: TransferEvent,
};

export default function findEventClassFor(type) {
  if (type in classes) {
    return classes[type];
  } else {
    throw new Error(`Didn't recognize type "${type}"`);
  }
}
