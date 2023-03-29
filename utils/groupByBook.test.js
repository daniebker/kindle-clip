const { groupByBook } = require("./groupByBook");

describe("test kindle_clip", () => {
  it("test kindle-clip.groupByBook", () => {
    const highlights = [
      {
        title: "The Art of War",
        author: "Sun Tzu",
        location: "95",
        locationText: "Chapter 1",
        text: "The art of war teaches us to rely not on the likelihood of the enemy's not coming, but on our own readiness to receive him; not on the chance of his not attacking, but rather on the fact that we have made our position unassailable.",
      },
      {
        title: "The Art of War",
        author: "Sun Tzu",
        location: "96",
        locationText: "Chapter 1",
        text: "The art of war teaches us to rely not on the likelihood of the enemy's not coming, but on our own readiness to receive him; not on the chance of his not attacking, but rather on the fact that we have made our position unassailable.",
      },
    ];
    const books = groupByBook(highlights);
    expect(Object.keys(books).length).toEqual(1);
  });
});
