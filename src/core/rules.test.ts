import { makeRules } from './rules';
import { SideType } from './types';
import { newBoard, newBoardFromData } from './utils';
import {login, sendData}  from '../qtest/qtest'

const { RED } = SideType;

type Object = {
  beginTime: Date,
  endTime: Date,
  id: String,
  status: Number
}

let i : number = 0
beforeAll(async () => {
  let a : Boolean = await login()
  if (a) console.info("Login Done")
  else console.error("Could not do Login")
})

describe('Rules', () => {

  let b : Object

  beforeEach(() => {
    b = {
      beginTime: new Date(),
      status: 602,
      id: "test_id",
      endTime: new Date()
    }
  })

  afterEach(() => {
   b.endTime = new Date()
   sendData(b)
  })

  describe('moves', () => {
    it('should initialize the board', () => {
      b.id = "test_id"
      const { getBoard } = makeRules(newBoard(), RED);
      const board = getBoard();
      expect(board[0][0]).toBe(1);
      b.status = 601

    });

    it('should initialize the side', () => {
      b.id = "test_id"
      const { getSide } = makeRules(newBoard(), RED);
      const side = getSide();
      expect(side).toBe(1);
      b.status = 601

    });

    it('should find the moves from this position', () => {
      b.id = "test_id"
      const { findMoves } = makeRules(newBoard(), RED);
      const plays = findMoves();

      expect(plays.length).toBe(7);
      // prettier-ignore
      expect(plays).toEqual([
        [[0, 2], [1, 3]],
        [[2, 2], [1, 3]],
        [[2, 2], [3, 3]],
        [[4, 2], [3, 3]],
        [[4, 2], [5, 3]],
        [[6, 2], [5, 3]],
        [[6, 2], [7, 3]],
      ]);
      b.status = 601
    });

    it('should find the jumps from this position', () => {
      b.id = "test_id"
      const { findJumps } = makeRules(newBoard(), RED);
      const plays = findJumps();
      expect(plays.length).toBe(0);
      b.status = 601
    });
  });

  describe('jumps', () => {
    // prettier-ignore
    const initialData = [
      [ 0,  0,  0,  0,  0,  0,  0,  0 ],
      [ 0,  0,  0,  0,  0,  0,  0,  0 ],
      [ 0,  0,  0,  0,  0, -1,  0,  0 ],
      [ 0,  0,  0,  0,  0,  0,  0,  0 ],
      [ 0,  0,  0, -1,  0, -1,  0,  0 ],
      [ 0,  0,  0,  0,  0,  0,  0,  0 ],
      [ 0, -1,  0, -1,  0,  0,  0,  0 ],
      [ 0,  0,  1,  0,  0,  0,  0,  0 ],
    ].reverse();

    it('should initialize the board', () => {
      b.id = "test_id"
      const { getBoard } = makeRules(newBoardFromData(initialData), RED);
      const board = getBoard();
      expect(board[0][0]).toBe(0);
      b.status = 601
    });

    it('should initialize the side', () => {
      b.id = "test_id"
      const { getSide } = makeRules(newBoardFromData(initialData), RED);
      const side = getSide();
      expect(side).toBe(1);
      b.status = 601
    });

    it('should find the jumps from this position', () => {
      b.id = "test_id"
      const { findJumps } = makeRules(newBoardFromData(initialData), RED);
      const plays = findJumps();

      expect(plays.length).toBe(3);
      expect(plays).toEqual([
        [
          [2, 0],
          [0, 2, 1, 1],
        ],
        [
          [2, 0],
          [4, 2, 3, 1],
          [2, 4, 3, 3],
        ],
        [
          [2, 0],
          [4, 2, 3, 1],
          [6, 4, 5, 3],
          [4, 6, 5, 5],
        ],
      ]);
      b.status = 601
    });

    it('should build a jump tree from this position', () => {
      b.id = "test_id"
      const { buildTree } = makeRules(newBoardFromData(initialData), RED);
      const plays = buildTree();

      expect(plays['2,0']['4,2']['6,4']['4,6']).toEqual({});
      expect(plays['2,0']['4,2']['2,4']).toEqual({});
      expect(plays['2,0']['0,2']).toEqual({});
      b.status = 601
    });
  });
});
