import AcquisitionEvent from "./AcquisitionEvent";
import IncorporationEvent from "./IncorporationEvent";
import JointVentureEvent from "./JointVentureEvent";
import MergerEvent from "./MergerEvent";
import SpinoffEvent from "./SpinoffEvent";
import TransferEvent from "./TransferEvent";

const CLASSES = {
  acquisition: AcquisitionEvent,
  incorporation: IncorporationEvent,
  jointVenture: JointVentureEvent,
  merger: MergerEvent,
  spinoff: SpinoffEvent,
  transfer: TransferEvent,
};

function resolveEventClassFrom(type) {
  if (type in CLASSES) {
    return CLASSES[type];
  } else {
    throw new Error(`Didn't recognize type ${type}`);
  }
}

export default function buildEvent(attrs) {
  const type = attrs.type;

  if (type == null) {
    throw new Error("No type was given");
  }

  const eventClass = resolveEventClassFrom(type);
  return new eventClass(attrs);
}
