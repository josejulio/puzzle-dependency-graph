import { PuzzleDependencyNode } from './PuzzleDependencyNode';

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

export class PuzzleDependencyGraph {
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
        const node = this.findNode(base);
        const targetId = this.findNode(depends).id;

        if (!node.depends.includes(targetId)) {
            node.depends.push(targetId);
        }
    }

    public addRequiredElement(node: NodeOrId, requires: string) {
        this.findNode(node).elements.required.push(requires);
    }

    public addTakenElement(node: NodeOrId, taken: string) {
        this.findNode(node).elements.taken.push(taken);
    }

    public addObtainedElement(node: NodeOrId, obtained: string) {
        this.findNode(node).elements.obtained.push(obtained);
    }

    public getNodes(): ReadonlyArray<Required<Readonly<PuzzleDependencyNode>>> {
        return Object.values(this.nodes);
    }

    public getDictionaryNodes(): Readonly<Record<string, Required<Readonly<PuzzleDependencyNode>>>> {
        return this.nodes;
    }

    private findNode(nodeOrId: NodeOrId) {
        const id = typeof nodeOrId === 'string' ? nodeOrId : nodeOrId.id;
        const found = this.nodes[id];
        if (!found) {
            throw new NodeNotFound(id);
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
            ...node,
            elements: {
                required: [],
                taken: [],
                obtained: [],
                ...node.elements
            }
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
