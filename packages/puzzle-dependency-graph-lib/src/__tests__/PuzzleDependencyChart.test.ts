import { Graph } from '../Graph';
import { Node } from '../Node';

describe('PuzzleDependencyChart', () => {
    it('Allows creation with all nodes', () => {
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
        expect(chart).toBeTruthy();
    });

    it('Fails if there are broken dependencies', () => {
        const unvalid: Array<Node> = [
            {
                id: 'a',
                title: 'A',
                depends: [
                    'b' // there is no b in the nodes
                ]
            }
        ];
        expect(() => new Graph(unvalid)).toThrow();
    });

    it('Allows to start with nothing and add dependencies', () => {
        const chart = new Graph();
        chart.addNode({
            id: 'unlock-basement-door',
            title: 'Unlock basement door'
        });
        chart.addNode({
            id: 'find-key',
            title: 'Find key'
        });
        chart.addDependency('unlock-basement-door', 'find-key');
        expect(chart.getNodes()).toEqual([
            {
                id: 'unlock-basement-door',
                title: 'Unlock basement door',
                depends: [ 'find-key' ],
                elements: {
                    required: [],
                    taken: [],
                    obtained: []
                }
            },
            {
                id: 'find-key',
                title: 'Find key',
                depends: [],
                elements: {
                    required: [],
                    taken: [],
                    obtained: []
                }
            }
        ]);
    });

    it('Fails if adding a dependency of a node that does not exist', () => {
        const chart = new Graph();
        chart.addNode({
            id: 'unlock-basement-door',
            title: 'Unlock basement door'
        });
        chart.addNode({
            id: 'find-key',
            title: 'Find key'
        });

        expect(() => chart.addDependency('foo', 'find-key')).toThrow();
        expect(() => chart.addDependency('unlock-basement-door', 'bar')).toThrow();
    });
});
