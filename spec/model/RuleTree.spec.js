import RuleChain from "model/RuleChain";
import RuleTree from "model/RuleTree";

describe("RuleTree", () => {
  describe("#cloned", () => {
    describe("when the RuleTree is empty", () => {
      it("returns another empty RuleTree", () => {
        const ruleTree = new RuleTree();

        expect(ruleTree.cloned()).toEqualTree(new RuleTree());
      });
    });
  });

  describe("#mergedWith", () => {
    describe("when the RuleTree was initialized with nothing", () => {
      describe("given an empty rule chain", () => {
        it("returns the same RuleTree", () => {
          const ruleTree = new RuleTree();

          const mergedRuleTree = ruleTree.mergedWith([]);

          expect(mergedRuleTree).toBe(ruleTree);
        });
      });

      describe("given a non-empty rule chain", () => {
        describe("of only one number", () => {
          it("returns a new RuleTree with the rule chain in it", () => {
            const mergedRuleTree = new RuleTree().mergedWith([1]);

            expect(mergedRuleTree).toEqualTree(
              new RuleTree(
                new RuleChain(1)
              )
            );
          });
        });

        describe("of multiple numbers", () => {
          it("returns a new RuleTree with the rule chain in it", () => {
            const mergedRuleTree = new RuleTree().mergedWith([1, 2]);

            expect(mergedRuleTree).toEqualTree(
              new RuleTree(
                new RuleChain(1, 2)
              )
            );
          });
        });
      });
    });

    describe("when the RuleTree was initialized with one rule chain", () => {
      describe("given an empty rule chain", () => {
        describe("when the sole rule chain had only one number", () => {
          it("returns the same RuleTree", () => {
            const ruleTree = new RuleTree([1]);

            const mergedRuleTree = ruleTree.mergedWith([]);

            expect(mergedRuleTree).toBe(ruleTree);
          });
        });

        describe("when the sole rule chain had multiple numbers", () => {
          it("returns the same RuleTree", () => {
            const ruleTree = new RuleTree([1, 2]);

            const mergedRuleTree = ruleTree.mergedWith([]);

            expect(mergedRuleTree).toBe(ruleTree);
          });
        });
      });

      describe("given one rule chain", () => {
        describe("which is identical to the chain in this RuleTree", () => {
          it("returns the same RuleTree", () => {
            const ruleTree = new RuleTree([1, 2]);

            const mergedRuleTree = ruleTree.mergedWith([1, 2]);

            expect(mergedRuleTree).toBe(ruleTree);
          });
        });

        describe("where the given rule chain intersects with the tree's rule chain at its first index", () => {
          describe("and everything after the first index is new", () => {
            it("returns a new RuleTree where the number is replaced with the rule chain", () => {
              const ruleTree = new RuleTree([1, 2, 3]);

              const mergedRuleTree = ruleTree.mergedWith([2, 4]);

              expect(mergedRuleTree).toEqualTree(
                new RuleTree(
                  new RuleChain(
                    1,
                    new RuleChain(2, 4),
                    3
                  )
                )
              );
            });
          });

          describe("and some numbers after the first index are already in the tree, just later", () => {
            it("does not move those indices", () => {
              const ruleTree = new RuleTree([1, 2, 3]);

              const mergedRuleTree = ruleTree.mergedWith([1, 3, 4]);

              // because 1 < 2, 2 < 3, 1 < 3 and 3 < 4 all combine to create
              // 1 < 2 < 3 < 4. there's an axiom in here, somewhere.
              expect(mergedRuleTree).toEqualTree(
                new RuleTree(
                  new RuleChain(
                    1,
                    2,
                    new RuleChain(3, 4),
                  )
                )
              );
            });
          });

          describe("and some numbers after the first index are already in the tree, but earlier", () => {
            describe("and they are in separate top-level rule chains", () => {
              it("rearranges the rule chains to match the given one", () => {
                const ruleTree = new RuleTree(
                  [0, 9],
                  [1, 4],
                  [2, 6],
                  [5, 10],
                  [3, 8]
                );

                const mergedRuleTree = ruleTree.mergedWith([2, 1, 3]);

                expect(mergedRuleTree).toEqualTree(
                  new RuleTree(
                    new RuleChain(0, 9),
                    new RuleChain(2, 6),
                    new RuleChain(1, 4),
                    new RuleChain(5, 10),
                    new RuleChain(3, 8),
                  )
                );
              });
            });

            describe("and they are in separate, inner rule chains", () => {
              it("rearranges the rule chains to match the given one", () => {
                const ruleTree = new RuleTree(
                  [4, 6],
                  [3, [1, 5]],
                  [9, 10],
                  [8, [2, 7]]
                );

                const mergedRuleTree = ruleTree.mergedWith([2, 1]);

                expect(mergedRuleTree).toEqualTree(
                  new RuleTree(
                    new RuleChain(4, 6),
                    new RuleChain(
                      8,
                      new RuleChain(2, 7),
                    ),
                    new RuleChain(9, 10),
                    new RuleChain(
                      3,
                      new RuleChain(1, 5),
                    ),
                  )
                );
              });
            });

            describe("and they are in the same top-level rule chain", () => {
              it("throws an error", () => {
                const ruleTree = new RuleTree([1, 2, 3, 4]);

                const mergingRuleChain = () => { ruleTree.mergedWith([2, 1]) };

                expect(mergingRuleChain).toThrowError(/Merge failed/);
              });
            });
          });
        });

        describe("where the given rule chain intersects with the tree's rule chain at its last index", () => {
          describe("and everything before the last index is new", () => {
            it("returns a new RuleTree where the number is replaced with the rule chain", () => {
              const ruleTree = new RuleTree([1, 2, 3]);

              const mergedRuleTree = ruleTree.mergedWith([4, 5, 3]);

              expect(mergedRuleTree).toEqualTree(
                new RuleTree(
                  new RuleChain(
                    1,
                    2,
                    new RuleChain(4, 5, 3),
                  )
                )
              );
            });
          });

          describe("and some numbers before the last index are already in the tree, just earlier", () => {
            it("does not move those other indices", () => {
              const ruleTree = new RuleTree([1, 2, 3, 5]);

              const mergedRuleTree = ruleTree.mergedWith([1, 4, 3]);

              expect(mergedRuleTree).toEqualTree(
                new RuleTree(
                  new RuleChain(
                    1,
                    2,
                    new RuleChain(4, 3),
                    5,
                  )
                )
              );
            });
          });
        });

        describe("where the given rule chain intersects with the tree's rule chain in the middle", () => {
          it("returns a new RuleTree with the intersection replaced with the rule chain", () => {
            const ruleTree = new RuleTree([1, 2, 3, 4]);

            const mergedRuleTree = ruleTree.mergedWith([5, 3, 6]);

            expect(mergedRuleTree).toEqualTree(
              new RuleTree(
                new RuleChain(
                  1,
                  2,
                  new RuleChain(5, 3, 6),
                  4,
                )
              )
            );
          });
        });

        describe("where the given rule chain intersects with the tree's rule chain at multiple points", () => {
          describe("and the rule chain intersects at its beginning", () => {
            it("injects the rule chain into the tree at the intersection", () => {
              const ruleTree = new RuleTree([1, 2, 3, 4]);

              const mergedRuleTree = ruleTree.mergedWith([1, 5, 7, 3, 8]);

              expect(mergedRuleTree).toEqualTree(
                new RuleTree(
                  new RuleChain(
                    1,
                    2,
                    new RuleChain(5, 7, 3, 8),
                    4,
                  )
                )
              );
            });
          });

          describe("and the rule chain intersects at its end", () => {
            it("injects the rule chain into the tree at the intersection", () => {
              const ruleTree = new RuleTree([1, 2, 3, 4]);

              const mergedRuleTree = ruleTree.mergedWith([5, 6, 2, 7, 4]);

              expect(mergedRuleTree).toEqualTree(
                new RuleTree(
                  new RuleChain(
                    1,
                    2,
                    3,
                    new RuleChain(5, 6, 7, 4)
                  )
                )
              );
            });
          });
        });
      });
    });
  });

  describe("#flattened", () => {
    it("returns a flat array consisting of all numbers in the tree", () => {
      const ruleTree = new RuleTree(
        new RuleChain(
          1,
          2,
          new RuleChain(
            3,
            4,
            new RuleChain(5)
          ),
        ),
        new RuleChain(
          6
        )
      );

      expect(ruleTree.flattened()).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });
});
