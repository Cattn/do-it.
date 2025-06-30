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

export const MULTIPLIER_ITEMS = [
    {
        name: '10x Click Multiplier',
        key: '10x-click-multiplier',
        description: 'A 10x click multiplier. Your papers will be done 10x as fast.',
        basePrice: 1,
        limit: 1,
        multiplier: 10,
        type: 'click'
    },
    {
        name: '1.2x Paper Multiplier',
        key: '1-2x-paper-multiplier',
        description: 'A 1.2x paper multiplier. Your papers will be done 1.2x as fast.',
        basePrice: 3,
        limit: 1,
        multiplier: 1.2,
        type: 'paper'
    },
    {
        name: '1.3x Paper Multiplier',
        key: '1-3x-paper-multiplier',
        description: 'A 1.3x paper multiplier. Your papers will be done 1.3x as fast.',
        basePrice: 5,
        limit: 1,
        multiplier: 1.3,
        type: 'paper'
    },
    {
        name: '50x Click Multiplier',
        key: '50x-click-multiplier',
        description: 'A 5x click multiplier. Your papers will be done 50x as fast.',
        basePrice: 6,
        limit: 1,
        multiplier: 50,
        type: 'click'
    },
    {
        name: '1000x Click Multiplier',
        key: '100x-click-multiplier',
        description: 'A 100x click multiplier. Your papers will be done 1000x as fast.',
        basePrice: 10,
        limit: 1,
        multiplier: 1000,
        type: 'click'
    }
]