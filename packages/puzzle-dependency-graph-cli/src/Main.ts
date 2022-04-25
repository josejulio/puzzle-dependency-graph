import { readFileSync } from 'fs';
import { Graph, simulate } from 'puzzle-dependency-graph-lib';
import { digraph, INode, toDot } from 'ts-graphviz';

import { getCommand } from './Command';

export interface Options {
    graphviz: boolean;
    input: string;
    graphvizDirection
}

export const execute = async (options: Options) => {
    const input = JSON.parse(readFileSync(options.input, 'utf-8'));
    const graph = new Graph(input);

    const result = simulate(graph);

    if (!result.success) {
        console.log(`Found ${result.messages.length} issues`);
        for (const message of result.messages) {
            console.log(`${message.description}:\n\tactions:${message.path.join(', ')}\n\telements:${message.currentElements.join(', ')}`);
        }

        return 1;
    }

    if (options.graphviz) {
        const graphviz = digraph('puzzle-dependency-graph', {
            rankdir: options.graphvizDirection
        });
        const graphvizNodes: Record<string, INode> = {};

        for (const node of graph.getNodes()) {
            graphvizNodes[node.id] = graphviz.createNode(node.id);
            graphviz.addNode(graphvizNodes[node.id]);
        }

        for (const node of graph.getNodes()) {
            for (const depends of node.depends) {
                graphviz.addEdge(
                    graphviz.createEdge([ depends, node.id ])
                );
            }
        }

        console.log(toDot(graphviz));
    }
};

if (require.main === module) {
    const program = getCommand();
    program.parse(process.argv);
    execute(program.opts() as Options);
}
