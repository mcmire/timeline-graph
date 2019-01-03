import spliceInto from "model/spliceInto";

describe("spliceInto", () => {
  describe("given two empty rules", () => {
    it("returns an empty array", () => {
      const order = spliceInto([], []);
      expect(order).toEqual([]);
    });
  });

  describe("given a non-empty target rule and an empty source rule", () => {
    describe("where the target has only one index", () => {
      it("returns the target", () => {
        const order = spliceInto([1], []);
        expect(order).toEqual([1]);
      });
    });

    describe("where the target has multiple indices", () => {
      it("returns the target", () => {
        const order = spliceInto([1, 2], []);
        expect(order).toEqual([1, 2]);
      });
    });
  });

  describe("given an empty target rule and a non-empty source rule", () => {
    describe("where the source only has one index", () => {
      it("returns the source", () => {
        const order = spliceInto([], [1]);
        expect(order).toEqual([1]);
      });
    });

    describe("where the source has multiple indices", () => {
      it("returns the source", () => {
        const order = spliceInto([], [1, 2]);
        expect(order).toEqual([1, 2]);
      });
    });
  });

  describe("given two non-empty rules", () => {
    describe("which are identical", function () {
      it("returns the same rule", () => {
        const order = spliceInto([1, 2], [1, 2]);
        expect(order).toEqual([1, 2]);
      });
    });

    describe("where the source rule intersects with the target rule at its first index", () => {
      describe("and everything after the first index is new", () => {
        it("injects the source rule into the target at the intersection", () => {
          const order = spliceInto([1, 2, 3], [2, 4]);
          expect(order).toEqual([1, 2, 3, 4]);
        });
      });

      describe("and some indices after the first are already in the target rule, just later", () => {
        it("does not move those indices", () => {
          const order = spliceInto([1, 2, 3, 4], [2, 5, 4]);
          expect(order).toEqual([1, 2, 3, 5, 4]);
        });
      });

      describe("and some indices after the first are already in the target rule, but before", () => {
        it("returns the target rule", () => {
          const order = spliceInto([1, 2, 3, 4], [2, 1]);
          expect(order).toEqual([1, 2, 3, 4]);
        });
      });
    });

    describe("where the source rule intersects with the target rule at its last index", () => {
      describe("and everything before the last index is new", () => {
        it("injects the source rule into the target at the intersection", () => {
          const order = spliceInto([1, 2, 3], [4, 5, 3]);
          expect(order).toEqual([1, 2, 4, 5, 3]);
        });
      });

      describe("and some indices before the first are already in the target rule, just before", () => {
        it("does not move those other indices", () => {
          const order = spliceInto([1, 2, 3, 5], [1, 4, 3]);
          expect(order).toEqual([1, 2, 4, 3, 5]);
        });
      });
    });

    describe("where the source rule intersects with the target rule in the middle", () => {
      it("injects the source rule into the target at the intersection", () => {
        const order = spliceInto([1, 2, 3, 4], [5, 3, 6]);
        expect(order).toEqual([1, 2, 5, 3, 4, 6]);
      });
    });

    describe("where the source rule intersects with the target rule at multiple points", () => {
      describe("and the first segment intersects at its beginning", () => {
        it("injects the source rule into the target at the intersection", () => {
          const order = spliceInto([1, 2, 3, 4], [1, 5, 7, 3, 8]);
          expect(order).toEqual([1, 2, 5, 7, 3, 4, 8]);
        });
      });

      describe("and the first segment intersects at its end", () => {
        it("injects the source rule into the target at the intersection", () => {
          const order = spliceInto(
            [1,    2, 3, 4],
            [5, 6, 2, 7, 4]
          );
          expect(order).toEqual([1, 5, 6, 2, 3, 7, 4]);
        });
      });
    });

    describe("where all of the indices in the source rule are in the target, just with possibly other indices in between", () => {
      it("just returns the target rule", () => {
        const order = spliceInto([1, 2, 3, 4], [2, 4]);
        expect(order).toEqual([1, 2, 3, 4]);
      });
    });

    describe("which do not intersect at all", () => {
      it("returns a combination of them", () => {
        const order = spliceInto([1, 2], [3, 4]);
        expect(order).toEqual([1, 2, 3, 4]);
      });
    });
  });
});
