import alignSequences from "model/alignSequences";

describe("alignSequences", () => {
  describe("given two empty sequences", () => {
    it("returns the same empty sequences", () => {
      const result = alignSequences({
        source: [],
        target: [],
      });
      expect(result).toEqual({
        intersection: [],
        pillars: [],
        source: [],
        target: [],
      });
    });
  });

  describe("given an empty sequence as the source and non-empty sequence as the target", () => {
    describe("where the non-empty sequence only has one index", () => {
      it("returns the target sequence as-is and the source sequence with nulls for the same places", () => {
        const result = alignSequences({
          source: [],
          target: [1],
        });
        expect(result).toEqual({
          intersection: [null],
          pillars: [],
          source: [null],
          target: [1],
        });
      });
    });

    describe("where the non-empty sequence has multiple indices", () => {
      it("returns the first sequence as-is and the second sequence with nulls for the same places", () => {
        const result = alignSequences({
          source: [],
          target: [1, 2],
        });
        expect(result).toEqual({
          intersection: [null, null],
          pillars: [],
          source: [null, null],
          target: [1, 2],
        });
      });
    });
  });

  describe("given two non-empty sequences", () => {
    describe("which are identical", function () {
      it("returns the same sequences", () => {
        const result = alignSequences({
          source: [1, 2],
          target: [1, 2],
        });
        expect(result).toEqual({
          intersection: [1, 2],
          pillars: [0, 1],
          source: [1, 2],
          target: [1, 2],
        });
      });
    });

    describe("where the source sequence intersects with the target sequence past its start", () => {
      it("adds a gap to the source sequence so the common values line up", () => {
        const result = alignSequences({
          source: [2, 4],
          target: [1, 2, 3],
        });
        expect(result).toEqual({
          intersection: [null, 2, null],
          pillars: [1],
          source: [null, 2, 4],
          target: [1,    2, 3],
        });
      });
    });

    describe("where the source sequence intersects with the target sequence past its start", () => {
      it("adds a gap to the source sequence so the common values line up", () => {
        const result = alignSequences({
          source: [1, 2, 3],
          target: [2, 4],
        });
        expect(result).toEqual({
          intersection: [null, 2, null],
          pillars: [1],
          source: [1,    2, 3],
          target: [null, 2, 4],
        });
      });
    });

    describe("where the source sequence intersects the target at multiple points", () => {
      describe("and the source's first segment intersects at the target's beginning", () => {
        it("adds gaps as needed to each sequence to make them line up", () => {
          const result = alignSequences({
            source: [1, 5, 7, 3, 8],
            target: [1, 2, 3, 4, 6, 8],
          });
          expect(result).toEqual({
            intersection: [1, null, null, 3, null, null, 8],
            pillars: [0, 3, 6],
            source: [1, 5, 7,    3, null, null, 8],
            target: [1, 2, null, 3, 4,    6,    8],
          });
        });
      });

      describe("and the source's first segment intersects at the target's end", () => {
        it("ensures they line up appropriately", () => {
          const result = alignSequences({
            source: [5, 6, 2, 7, 4],
            target: [1, 2, 3, 4],
          });
          expect(result).toEqual({
            intersection: [null, null, 2, null, 4],
            pillars: [2, 4],
            source: [5, 6,    2, 7, 4],
            target: [1, null, 2, 3, 4],
          });
        });
      });

      describe("and the connections between the sequences cross each other", () => {
        it("raises an error", () => {
          const aligningSequences = () => {
            alignSequences({
              source: [2, 5, 1],
              target: [1, 2, 3, 4],
            });
          };

          expect(aligningSequences).toThrow(/Could not align sequences/);
        });
      });
    });

    describe("which do not intersect at all", () => {
      it("returns the same sequences", () => {
        const result = alignSequences({
          source: [3, 4],
          target: [1, 2],
        });
        expect(result).toEqual({
          intersection: [null, null],
          pillars: [],
          source: [3, 4],
          target: [1, 2],
        });
      });
    });

    describe("where the source sequence is shorter than the target sequence", () => {
      it("fills in any missing spaces in the source sequence with nulls", () => {
        const result = alignSequences({
          source: [1, 2, 3],
          target: [1, 2, 3, 4, 5],
        });
        expect(result).toEqual({
          intersection: [1, 2, 3, null, null],
          pillars: [0, 1, 2],
          source: [1, 2, 3, null, null],
          target: [1, 2, 3, 4, 5],
        });
      });
    });
  });
});
