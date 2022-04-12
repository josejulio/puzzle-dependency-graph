import { DeepRequired } from 'ts-essentials';

import { Node } from './Node';

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

type NodeOrId = Node | Node['id'];

export class Graph {
    private readonly nodes: Record<string, DeepRequired<Node>>;

    public constructor(nodes?: Array<Node>) {
        this.nodes = {};

        if (nodes) {
            for (const node of nodes) {
                this.addNodeWithValidation(node, false);
            }

            this.validateDependencies();
        }
    }

    public addNode(node: Node) {
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

    public getNodes(): ReadonlyArray<DeepRequired<Readonly<Node>>> {
        return Object.values(this.nodes);
    }

    public getDictionaryNodes(): Readonly<Record<string, DeepRequired<Readonly<Node>>>> {
        return this.nodes;
    }

    private findNode(nodeOrId: NodeOrId): DeepRequired<Node> {
        const id = typeof nodeOrId === 'string' ? nodeOrId : nodeOrId.id;
        const found = this.nodes[id];
        if (!found) {
            throw new NodeNotFound(id);
        }

        return found;
    }

    private addNodeWithValidation(node: Node, validateDependents: boolean) {
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
