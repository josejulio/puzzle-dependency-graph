import {PuzzleDependencyChart} from "../PuzzleDependencyChart";
import {PuzzleDependencyNode} from "../PuzzleDependencyNode";

describe('PuzzleDependencyChart', () => {
    it('Allows creation with all nodes', () => {
        const validNodes: Array<PuzzleDependencyNode> = [
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

        const chart = new PuzzleDependencyChart(validNodes);
        expect(chart).toBeTruthy();
    });

    it('Fails if there are broken dependencies', () => {
        const unvalid: Array<PuzzleDependencyNode> = [
            {
                id: 'a',
                title: 'A',
                depends: [
                    'b' // there is no b in the nodes
                ]
            }
        ];
        expect(() => new PuzzleDependencyChart(unvalid)).toThrow();
    });

    it('Allows to start with nothing and add dependencies', () => {
        const chart = new PuzzleDependencyChart();
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
                depends: [ 'find-key' ]
            },
            {
                id: 'find-key',
                title: 'Find key',
                depends: []
            }
        ])
    });

    it('Fails if adding a dependency of a node that does not exist', () => {
        const chart = new PuzzleDependencyChart();
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
