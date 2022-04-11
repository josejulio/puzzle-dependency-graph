# Puzzle dependency graph tool

This is a tool that aims to help with the design of puzzle dependency graph. Based off several information found on the web:
- Post by [Ron Gilbert](https://grumpygamer.com/puzzle_dependency_charts) 
and [Joshua Weinberg](http://thewebsiteisdown.com/twidblog/puzzle-dependency-graph-primer/)
- Talk by [Noah Falstein](https://www.gdcvault.com/play/1017978/The-Arcane-Art-of-Puzzle)

The plan is to start with a CLI tool to load and validate the dependencies are valid. It will also
optionally add some ideas I've to help with the design/validation. 

After the CLI I would like to add a GUI (using [cytoscape](https://js.cytoscape.org/)) for the graph 
visualization and manipulation.

Should be able to map dependencies:

```
( find chainsaw ) \
( find gas ) -> ( use gas with chainsaw ) -> ??
```

and each node should be able to have a list of `required` elements (an element can be anything, 
an item, an event that is required, etc), `taken` and `obtained` elements.

## Structure of a node in the graph

Below code maps above graph.

```typescript
const graph = [
    {
        id: 'find-chainsaw',
        title: 'Find chainsaw',
        depends: [],
        elements: {
            required: [ ],
            taken: [],
            obtained: [
                'chainsaw'
            ]
        }
    },
    {
        id: 'find gas',
        title: 'Find gas',
        depends: [],
        elements: {
            required: [ ],
            taken: [],
            obtained: [
                'gas'
            ]
        }
    },
    {
        id: 'use-gas-with-chainsaw',
        title: 'Use gas with chainsaw',
        depends: [ 'find-gas', 'find-chainsaw' ],
        elements: {
            required: [
                'gas', 'chainsaw'
            ],
            taken: [
                'gas', 'chainsaw'
            ],
            obtained: [
                'chainsaw-with-gas'
            ]
        }
    }
];
```
