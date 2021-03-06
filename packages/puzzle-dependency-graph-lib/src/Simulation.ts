import produce from 'immer';
import { DeepRequired } from 'ts-essentials';

import { Graph } from './Graph';
import { Node } from './Node';

interface State {
    nodes: Record<string, DeepRequired<Node>>;
    elements: Array<string>;
    steps: Array<string>;
}

export interface SimulateReport {
    success: boolean;
    messages: Array<{
        path: Array<string>;
        currentElements: Array<string>;
        description: string;
    }>;
}

export const simulate = (puzzleGraph: Graph): SimulateReport => {
    const nodes = puzzleGraph.getDictionaryNodes();
    const initialState: State = {
        nodes: { ...nodes },
        elements: [],
        steps: []
    };

    const report: SimulateReport = {
        success: true,
        messages: []
    };

    runSimulation(initialState, report);

    return report;
};

const runSimulation = (state: State, report: SimulateReport) => {
    const next = nextSteps(Object.values(state.nodes));

    if (next.length === 0 && Object.values(state.nodes).length > 0) {
        failReport('Dead end found', state, report);
        return;
    }

    for (const step of next) {
        if (!canDoStep(state, step)) {
            failReport(`Dead end found - no elements to transverse to "${step}"`, state, report);
        }

        const nextState = runStep(state, step);

        runSimulation(
            nextState,
            report
        );
    }
};

const failReport = (description: string, state: State, report: SimulateReport) => {
    report.success = false;
    report.messages.push({
        path: state.steps,
        currentElements: state.elements,
        description
    });
};

/**
 * This looks for steps that can be performed regarding the dependency chart
 * @param nodes
 * @param from
 */
const nextSteps = (nodes: ReadonlyArray<DeepRequired<Node>>, from?: string): Array<string> => {
    return nodes
    .filter(n => !from || n.id === from)
    .filter(n => n.depends.length === 0)
    .map(step => step.id);
};

/**
 * - Also, this algorithm should be change, it should be able to proceed to the next step if we
 *   don't dependent on it. The items is more a decorator to validate our dependency.
 *  Update algorithm ,if next step does not have any dependency and we can't proceed, trigger an error
 * @param state
 * @param next
 */
const canDoStep = (state: State, next: string) => {
    const available = [ ...state.elements ];
    state.nodes[next].elements.required.every(el => {
        const foundIndex = available.indexOf(el);
        if (foundIndex !== -1) {
            available.splice(foundIndex, 1);
        }

        return foundIndex !== -1;
    });

    return state.nodes[next].elements.required.every(el => state.elements.includes(el));
};

const runStep = (state: State, next: string) => {
    const step = state.nodes[next];
    const removeDependency = Object.values(state.nodes)
    .filter(node => node.depends.includes(next))
    .map(node => node.id);

    return produce(state, draft => {
        delete draft.nodes[next];
        draft.steps.push(next);

        for (const toRemove of step.elements.taken) {
            const index = draft.elements.indexOf(toRemove);
            draft.elements.splice(index, 1);
        }

        for (const toRemove of removeDependency) {
            const node = draft.nodes[toRemove];
            const index = node.depends.indexOf(next);
            node.depends.splice(index, 1);
        }

        draft.elements.push(...step.elements.obtained);
    });
};
