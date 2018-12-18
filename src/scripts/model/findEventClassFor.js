import IncorporationEvent from "./IncorporationEvent";
import JointVentureEvent from "./JointVentureEvent";
import TransferEvent from "./TransferEvent";
import AcquisitionEvent from "./AcquisitionEvent";
import MergerEvent from "./MergerEvent";
import SpinoffEvent from "./SpinoffEvent";

const classes = {
  incorporation: IncorporationEvent,
  jointVenture: JointVentureEvent,
  transfer: TransferEvent,
  acquisition: AcquisitionEvent,
  merger: MergerEvent,
  spinoff: SpinoffEvent,
};

export default function findEventClassFor(type) {
  if (type in classes) {
    return classes[type];
  } else {
    throw new Error(`Didn't recognize type ${type}`);
  }
}
