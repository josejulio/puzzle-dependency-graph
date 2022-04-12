import { theDigNodes } from '../__fixtures__/the-dig';
import { Graph } from '../Graph';
import { Node } from '../Node';
import { simulate } from '../Simulation';

describe('PuzzleSimulation', () => {
    it('Succeeds on simple case (no elements)', ()=> {
        const validNodes: Array<Node> = [
            {
                id: 'break-window',
                title: 'Break window',
                depends: []
            },
            {
                id: 'climb-in-window',
                title: 'Climb in window',
                depends: [
                    'break-window'
                ]
            },
            {
                id: 'find-key-behind-plant',
                title: 'Find key behind plant',
                depends: [
                    'climb-in-window'
                ]
            },
            {
                id: 'unlock-basement-door',
                title: 'Unlock basement door',
                depends: [
                    'find-key-behind-plant'
                ]
            },
            {
                id: 'open-basement-door',
                title: 'Open basement door',
                depends: [
                    'unlock-basement-door',
                    'oil-hinges'
                ]
            },
            {
                id: 'find-oil-can',
                title: 'Find oil can',
                depends: [
                    'climb-in-window'
                ]
            },
            {
                id: 'oil-hinges',
                title: 'Oil hinges',
                depends: [
                    'find-oil-can'
                ]
            }
        ];

        const chart = new Graph(validNodes);
        expect(simulate(chart).success).toEqual(true);
    });

    it('Simple dead end', () => {
        const chart = new Graph([
            {
                id: 'use-chainsaw',
                title: 'Use chain saw',
                elements: {
                    required: [
                        'gas'
                    ]
                }
            }
        ]);

        expect(simulate(chart)).toMatchObject({
            success: false,
            messages: [
                {
                    path: [],
                    currentElements: [],
                    description: 'Dead end found - no elements to transverse to "use-chainsaw"'
                }
            ]
        });
    });

    it('More complicated dead ends', () => {
        const validNodes: Array<Node> = [
            {
                id: 'break-window',
                title: 'Break window',
                depends: []
            },
            {
                id: 'climb-in-window',
                title: 'Climb in window',
                depends: [
                    'break-window'
                ]
            },
            {
                id: 'find-key-behind-plant',
                title: 'Find key behind plant',
                depends: [
                    'climb-in-window'
                ]
            },
            {
                id: 'unlock-basement-door',
                title: 'Unlock basement door',
                depends: [
                    'find-key-behind-plant'
                ],
                elements: {
                    required: [ 'glasses' ]
                }
            },
            {
                id: 'open-basement-door',
                title: 'Open basement door',
                depends: [
                    'unlock-basement-door',
                    'oil-hinges'
                ]
            },
            {
                id: 'find-oil-can',
                title: 'Find oil can',
                depends: [
                    'climb-in-window'
                ]
            },
            {
                id: 'oil-hinges',
                title: 'Oil hinges',
                depends: [
                    'find-oil-can'
                ]
            }
        ];

        const chart = new Graph(validNodes);

        const result = simulate(chart);

        expect(result.success).toBe(false);
        expect(result.messages).toHaveLength(6);
        result.messages.every(m => {
            expect(m.description).toEqual('Dead end found - no elements to transverse to "unlock-basement-door"');
        });
    });

    it('Tests The Dig', () => {
        const chart = new Graph(theDigNodes);
        const result = simulate(chart);
        expect(result.success).toBe(true);
    });
});
