'use strict';

import Rules from '../rules';

import defaultEvaluator from './default_evaluator';

export default class Analyzer extends Rules {
  constructor(board, side) {
    super(board, side);

    // a flat version of the board backed by the same data
    this.flat = new Int8Array(board[0].buffer, 0, 64);

    // use default evaluator for both sides (but feel free to change it)
    this.redEval = this.whiteEval = defaultEvaluator;

    // how many levels deep to search the tree
    this.level = 8;
  }

  evaluate() {
    // delegate to the current player's evaluator
    let playerEval = this.side == 1 ? this.redEval : this.whiteEval;

    return playerEval.evaluate(this.flat);
  }

  run() {
    // keep track of the current player's evaluator when switching sides
    let playerEval = this.side == 1 ? this.redEval : this.whiteEval,
        initial = playerEval.evaluate(this.flat);

    // loop entry point as we recurse into the void
    let loop = (level) => {
      let bestScore, bestPlay, current;

      // always try to find counter-jumps from this position
      let canJump = this.myJumps(jump => {
        // switch sides and descend a level
        this.side = -this.side;
        current = loop(level - 1)[1];
        this.side = -this.side;

        // keep track of the best move from this position
        if (bestScore === undefined ||
            (this.side == +1 && current > bestScore) ||
            (this.side == -1 && current < bestScore)) {
          bestPlay = jump;
          bestScore = current;
        }
      });

      if (!canJump) {
        current = playerEval.evaluate(this.flat);

        let gain = current - initial;

        // see if we've hit bottom
        if (level <= 0 ||
            (level <= 2 && (gain <= -25 || gain >= +25)) ||
            (level <= 4 && (gain <= -75 || gain >= +75))) {
          // return score for this position
          bestScore = current;
        } else {
          // find counter-moves from this position
          this.myMoves(move => {
            // switch sides and descend a level
            this.side = -this.side;
            current = loop(level - 1)[1];
            this.side = -this.side;

            // keep track of the best move from this position
            if (bestScore === undefined ||
                (this.side == +1 && current > bestScore) ||
                (this.side == -1 && current < bestScore)) {
              bestPlay = move;
              bestScore = current;
            }
          });
        }
      }

      // if there are no moves from this position, the player loses
      if (bestScore === undefined) {
        bestScore = -this.side * Infinity;
      }

      // a pair representing the winning play and score for this turn
      return [bestPlay, bestScore];
    }

    // start at the top level
    return loop(this.level);
  }
}

// export the evaluator submodule
export { Evaluator } from './evaluator';
