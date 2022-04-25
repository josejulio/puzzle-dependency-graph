import { Command } from 'commander';

export const getCommand = () => {
    const command = new Command;

    command
    .description(
        'Validates a puzzle dependency graph by ensuring that there is always a starting point (nodes with no dependencies) \n'
            + 'and that we can transverse all the dependencies until the end.\n'
            + 'Additional it will accept `elements` to ensure that the required/obtained/taken elements are always correct. These \n'
            + 'elements can be items or any other event.\n'
            + 'Options are provided to generate a graphviz format of the dependency graph.'

    )
    .option(
        '-g, --graphviz',
        'Outputs a graphviz representation of the puzzle',
        false
    )
    .option(
        '-gd, --graphviz-direction <graph-direction LR|TB>',
        'Passed to graphviz to configure the graph direction e.g. (LR left to right, TB top to bottom, etc)',
        'LR'
    )
    .requiredOption(
        '-i, --input <puzzle-dependency-graph-array>',
        'Input file'
    );

    return command;
};
