// shop will display the name, description, price
// then pMultiplier will be the multiplier of the price, going each time the user buys it

export const SHOP_ITEMS = [
    {
        name: 'Basic Pencil',
        key: 'basic-pencil',
        description: 'A basic pencil. You can write pretty slowly with it.',
        basePrice: 10,
        pMultiplier: 1.1,
        limit: 10,
        pps: 1,
        ppsMultiplier: 1.1
    },
    {
        name: 'Starter Pen',
        key: 'starter-pen',
        description: 'A starter pen. Your writing looks a bit better with it.',
        basePrice: 1000,
        pMultiplier: 1.3,
        limit: 10,
        pps: 5,
        ppsMultiplier: 1.2
    },
    {
        name: 'Advanced Pencil',
        key: 'advanced-pencil',
        description: 'An advanced pencil. You can write pretty fast with it.',
        basePrice: 10000,
        pMultiplier: 1.5,
        limit: 10,
        pps: 100,
        ppsMultiplier: 1.3
    },
    {
        name: 'Advanced Pen',
        key: 'advanced-pen',
        description: 'An advanced pen. Your writing looks a lot better with it.',
        basePrice: 100000,
        pMultiplier: 1.7,
        limit: 10,
        pps: 500,
        ppsMultiplier: 1.4
    }
];