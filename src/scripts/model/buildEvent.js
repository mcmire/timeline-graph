import findEventClassFor from "./findEventClassFor";

export default function buildEvent(attrs) {
  const type = attrs.type;

  if (type == null) {
    throw new Error("No type was given");
  }

  const eventClass = findEventClassFor(type);
  return new eventClass(attrs);
}
