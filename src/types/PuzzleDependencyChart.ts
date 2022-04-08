import {PuzzleDependencyNode} from "./PuzzleDependencyNode";

class NodeAlreadyExists extends Error {
    public constructor(id: string) {
        super(`Node already exists ${id}`);
    }
}

class NodeNotFound extends Error {
    public constructor(id: string) {
        super(`Node not found ${id}`);
    }
}

type NodeOrId = PuzzleDependencyNode | PuzzleDependencyNode['id'];

export class PuzzleDependencyChart {
    private readonly nodes: Record<string, Required<PuzzleDependencyNode>>;

    public constructor(nodes?: Array<PuzzleDependencyNode>) {
        this.nodes = {};

        if (nodes) {
            for (const node of nodes) {
                this.addNodeWithValidation(node, false);
            }
            this.validateDependencies();
        }
    }

    public addNode(node: PuzzleDependencyNode) {
        this.addNodeWithValidation(node, true);
    }

    public addDependency(base: NodeOrId, depends: NodeOrId) {
        this.findNode(base).depends.push(
            this.findNode(depends).id
        );
    }

    public getNodes(): ReadonlyArray<Required<Readonly<PuzzleDependencyNode>>> {
        return Object.values(this.nodes);
    }

    private findNode(nodeOrId: NodeOrId) {
        if (typeof nodeOrId === 'string') {

        }
        const id = typeof nodeOrId === 'string' ? nodeOrId : nodeOrId.id;
        const found = this.nodes[id];
        if (!found) {
            throw new NodeNotFound(id)
        }

        return found;
    }

    private addNodeWithValidation(node: PuzzleDependencyNode, validateDependents: boolean) {
        if (this.nodes[node.id]) {
            throw new NodeAlreadyExists(node.id);
        }

        if (validateDependents && node.depends) {
            for (const depends of node.depends) {
                if (!this.nodes[depends]) {
                    throw new NodeNotFound(depends);
                }
            }
        }

        // Put defaults for everything
        this.nodes[node.id] = {
            depends: [],
            ...node
        };
    }

    private validateDependencies() {
        for (const key in this.nodes) {
            const node = this.nodes[key];
            for (const depends of node.depends) {
                if (!this.nodes[depends]) {
                    throw new NodeNotFound(depends);
                }
            }
        }
    }

}
