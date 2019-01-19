import RuleChain from "model/RuleChain";

describe("RuleChain", () => {
  describe("constructor", () => {
    describe("given no values", () => {
      it("returns an empty RuleChain", () => {
        const ruleChain = new RuleChain();
        expect(ruleChain).toEqualTree(new RuleChain());
      });

      it("returns a RuleChain with a length of 0", () => {
        const ruleChain = new RuleChain();
        expect(ruleChain.length).toBe(0);
      });
    });

    describe("given one value", () => {
      it("wraps that one value", () => {
        const ruleChain = new RuleChain(1);
        expect(ruleChain).toEqualTree(new RuleChain(1));
      });

      it("returns a RuleChain with a length of 1", () => {
        const ruleChain = new RuleChain(1);
        expect(ruleChain.length).toBe(1);
      });
    });

    describe("given a one-dimensional series of values", () => {
      it("returns a RuleChain wrapping those values", () => {
        const ruleChain = new RuleChain(1, 2, 3);
        expect(ruleChain).toEqualTree(new RuleChain(1, 2, 3));
      });
    });

    describe("given a multi-dimensional series of values where inner rule chains are arrays", () => {
      it("returns a RuleChain wrapping those values, with inner arrays being wrapped as well, tied to their parent RuleChain", () => {
        const ruleChain = new RuleChain(1, [2, 3, [4]], 5);
        expect(ruleChain).toEqualTree(
          new RuleChain(
            1,
            new RuleChain(2, 3, new RuleChain(4)),
            5,
          )
        );
        expect(ruleChain[1].parent).toBe(ruleChain);
        expect(ruleChain[1][2].parent).toBe(ruleChain[1]);
      });
    });
  });

  describe("#getRoot", () => {
    describe("when the rule chain is empty", () => {
      it("returns the same rule chain", () => {
        const ruleChain = new RuleChain();
        expect(ruleChain.getRoot()).toBe(ruleChain);
      });
    });

    describe("when the rule chain is at the top level", () => {
      it("returns the same rule chain", () => {
        const ruleChain = new RuleChain(1);
        expect(ruleChain.getRoot()).toBe(ruleChain);
      });
    });

    describe("when the rule chain is a descendant of another rule chain", () => {
      it("returns the most toplevel rule chain", () => {
        const ruleChain = new RuleChain(1, new RuleChain(2, new RuleChain(3)));
        expect(ruleChain[1][1].getRoot()).toBe(ruleChain);
      });
    });
  });

  describe("#withIndicesRemoved", () => {
    it("returns a new RuleChain with the given indices removed", () => {
      const ruleChain = new RuleChain(1, 2, 3, 4, 5);

      expect(ruleChain.withIndicesRemoved(1, 3)).toEqualTree(
        new RuleChain(1, 3, 5)
      );
    });
  });

  describe("#toDeepArray", () => {
    describe("when the rule chain has no values", () => {
      it("returns an empty array", () => {
        const ruleChain = new RuleChain();
        expect(ruleChain.toDeepArray()).toEqual([]);
      });
    });

    describe("when the rule chain has one value", () => {
      it("returns that one value in an array", () => {
        const ruleChain = new RuleChain(1);
        expect(ruleChain.toDeepArray()).toEqual([1]);
      });
    });

    it("returns the rule chain, and all of its descendants, as arrays", () => {
      const ruleChain = new RuleChain(
        1,
        new RuleChain(
          2,
          3,
          new RuleChain(4),
        ),
        5,
      );

      expect(ruleChain.toDeepArray()).toEqual([1, [2, 3, [4]], 5]);
    });
  });
});

describe("RuleChain.Shallow", () => {
  describe("constructor", () => {
    describe("given nothing", () => {
      it("returns an empty rule chain", () => {
        const ruleChain = new RuleChain.Shallow();
        expect(ruleChain).toEqualTree(new RuleChain());
      });
    });
  });
});
