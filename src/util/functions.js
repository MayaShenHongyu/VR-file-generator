// Helper function for randomizing the elements in a list
export const randomizeList = (list) =>
    list
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);
