import applyOrderingRules from "model/applyOrderingRules";

describe("applyOrderingRules", () => {
  describe("given no rules", () => {
    it("returns an empty array", () => {
      const order = applyOrderingRules([]);
      expect(order).toEqual([]);
    });
  });

  describe("given only one rule", () => {
    describe("with only one index", () => {
      it("returns an array of only that index", () => {
        const order = applyOrderingRules([[1]]);
        expect(order).toEqual([1]);
      });
    });

    describe("with multiple indices", () => {
      it("returns an array of those indices", () => {
        const order = applyOrderingRules([[1, 2]]);
        expect(order).toEqual([1, 2]);
      });
    });
  });

  describe("given two rules", () => {
    describe("where the second rule intersects with the first rule at its first index", () => {
      describe("and everything after the first index is new", () => {
        it("injects the second rule into the first at the intersection", () => {
          // [1, 2, 3] == [[1, 2], [2, 3]]
          // [1, 2, 3] + [2, 4] == [[1, 2], [2, 3]] + [2, 4] == [[1, 2], [2, 4], [4, 3]] == [1, 2, 4, 3]

          const order = applyOrderingRules([[1, 2, 3], [2, 4]]);
          expect(order).toEqual([1, 2, 4, 3]);
        });
      });

      describe("and some indices after the first are already in the first rule, just later", () => {
        it("does not move those other indices", () => {
          const order = applyOrderingRules([[1, 2, 3, 4], [2, 5, 4]]);
          expect(order).toEqual([1, 2, 5, 3, 4]);
        });
      });

      describe("and some indices after the first are already in the first rule, but before", () => {
        it("throws an error", () => {
          const applyingOrderingRules = () => {
            applyOrderingRules([[1, 2, 3, 4], [2, 5, 1]]);
          };

          expect(applyingOrderingRules).toThrow(/conflicting rule/);
        });
      });
    });

    describe("where the second rule intersects with the first rule at its last index", () => {
      describe("and everything before the last index is new", () => {
        it("injects the second rule into the first at the intersection", () => {
          // [1, 2, 3] == [[1, 2], [2, 3]]
          // [1, 2, 3] + [4, 5, 3]
          //   == [[1, 2], [2, 3]] + [4, 5, 3]
          //   == [[1, 2], [2, 3]] + [4, 5] + [5, 3]
          //   == [[1, 2], [2, 3], [4, 5]] + [5, 3]
          //   == [[1, 2], [2, 5], [5, 3], [4, 5]]  <== ok, now apply
          //   == [1, 2, 4, 5, 3]
          //
          // NOPE this won't work! I think we just need to apply [4, 5, 3]
          // backwards
          const order = applyOrderingRules([[1, 2, 3], [4, 5, 3]]);
          expect(order).toEqual([1, 2, 4, 5, 3]);
        });
      });

      describe("and some indices before the first are already in the first rule, just before", () => {
        it("does not move those other indices", () => {
          const order = applyOrderingRules([[1, 2, 3, 5], [1, 4, 3]]);
          expect(order).toEqual([1, 4, 2, 3, 5]);
        });
      });
    });

    describe("where the second rule intersects with the first rule in the middle", () => {
      it("injects the second rule into the first at the intersection", () => {
        const order = applyOrderingRules([[1, 2, 3, 4], [5, 3, 6]]);
        expect(order).toEqual([1, 2, 5, 3, 6, 4]);
      });
    });

    describe("where the second rule intersects with the first rule at multiple points", () => {
      it("injects the second rule into the first at the intersection", () => {
        const order = applyOrderingRules([[1, 2, 3, 4], [5, 6, 2, 7, 4]]);
        expect(order).toEqual([1, 5, 6, 2, 3, 7, 4]);
      });
    });

    describe("where all of the indices in the second rule are in the first, just with possibly other indices in between", () => {
      it("just returns the first rule", () => {
        const order = applyOrderingRules([[1, 2, 3, 4], [2, 4]]);
        expect(order).toEqual([1, 2, 3, 4]);
      });
    });

    describe("which do not intersect at all", () => {
      it("returns a combination of them", () => {
        const order = applyOrderingRules([[1, 2], [3, 4]]);
        expect(order).toEqual([1, 2, 3, 4]);
      });
    });
  });
});
