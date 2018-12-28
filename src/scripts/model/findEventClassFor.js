import AcquisitionEvent from "./AcquisitionEvent";
import HiddenEvent from "./HiddenEvent";
import IncorporationEvent from "./IncorporationEvent";
import JointVentureEvent from "./JointVentureEvent";
import MergerEvent from "./MergerEvent";
import ReleaseEvent from "./ReleaseEvent";
import SpinoffEvent from "./SpinoffEvent";
import TransferEvent from "./TransferEvent";

const classes = {
  acquisition: AcquisitionEvent,
  hidden: HiddenEvent,
  incorporation: IncorporationEvent,
  jointVenture: JointVentureEvent,
  merger: MergerEvent,
  release: ReleaseEvent,
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
