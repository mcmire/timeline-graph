export default function findFirstResult(collection, fn) {
  for (const value of collection) {
    const result = fn(value);

    if (result != null) {
      return result;
    }
  }

  return null;
}
