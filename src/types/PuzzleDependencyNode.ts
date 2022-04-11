export interface PuzzleDependencyNode {
    id: string;
    title: string;
    depends?: Array<string>;

    elements?: PuzzleDependencyElement;
}

export interface PuzzleDependencyElement {
    required?: Array<string>;
    taken?: Array<string>;
    obtained?: Array<string>;
}
