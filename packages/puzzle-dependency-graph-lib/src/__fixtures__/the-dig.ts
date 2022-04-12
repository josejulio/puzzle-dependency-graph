import { Node } from '../Node';

/**
 * Copied from http://dreamsofgerontius.com/2019/06/01/puzzle-dependency-charts/
 */
export const theDigNodes: Array<Node> = [
    // Level 0
    {
        id: 'begin',
        title: 'The Dig begins'
    },

    // Level 1
    {
        id: 'talk-with-miles',
        title: 'Talk with miles',
        depends: [ 'begin' ]
    },

    // Level 2
    {
        id: 'release-pig',
        title: 'Release pig',
        depends: [ 'talk-with-miles' ]
    },

    // Level 3
    {
        id: 'pick-bomb-beta',
        title: 'Bomb beta',
        depends: [ 'release-pig' ],
        elements: {
            obtained: [ 'bomb-beta' ]
        }
    },
    {
        id: 'pick-arming-key',
        title: 'Arming key',
        depends: [ 'release-pig' ],
        elements: {
            obtained: [ 'arming-key' ]
        }
    },
    {
        id: 'pick-shovel',
        title: 'Shovel',
        depends: [ 'release-pig' ],
        elements: {
            obtained: [ 'shovel' ]
        }
    },
    {
        id: 'pick-bomb-alpha',
        title: 'Bomb alpha',
        depends: [ 'release-pig' ],
        elements: {
            obtained: [ 'bomb-alpha' ]
        }
    },
    {
        id: 'pick-digger',
        title: 'Digger',
        depends: [ 'release-pig' ],
        elements: {
            obtained: [ 'digger' ]
        }
    },

    // Level 4
    {
        id: 'move-boulder',
        title: 'Move boulder',
        depends: [ 'pick-shovel' ]
    },
    {
        id: 'flatten-ground',
        title: 'Flatten ground',
        depends: [ 'pick-digger' ]
    },

    // Level 5
    {
        id: 'plant-bomb-beta',
        title: 'Plant/arm bomb beta',
        depends: [ 'pick-bomb-beta', 'pick-arming-key', 'move-boulder' ],
        elements: {
            obtained: [ 'bomb-beta', 'arming-key' ]
        }
    },
    {
        id: 'plant-bomb-alpha',
        title: 'Plant/arm bomb alpha',
        depends: [ 'pick-bomb-alpha', 'pick-arming-key', 'pick-digger' ]
    },

    // level 6
    {
        id: 'plant-both-bombs',
        title: 'Plant/arm both bombs',
        depends: [ 'plant-bomb-beta', 'plant-bomb-alpha' ]
    },

    // level 7
    {
        id: 'detonate-bomb',
        title: 'Detonate bomb',
        depends: [ 'plant-both-bombs' ]
    }

];
