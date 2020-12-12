import { makeRules } from './rules';
import { BoardType, MoveType, SideType } from './types';
import { newBoard, newBoardFromData } from './utils';
import {login, sendData}  from '../qtest/qtest'

const { RED, WHT } = SideType;

type Object = {
  beginTime: Date,
  endTime: Date,
  id: String,
  status: Number
}

let i : number = 0
beforeAll(async () => {
 // let a : Boolean = await login()
 // if (a) console.info("Login Done")
 // else console.error("Could not do Login")
})

describe('Rules', () => {

  let b : Object

  beforeEach(() => {
    b = {
      beginTime: new Date(),
      status: 602,
      id: "2",
      endTime: new Date()
    }
  })

  afterEach(() => {
   b.endTime = new Date()
   //sendData(b)
  })

  describe('moves', () => {
    it('should initialize the board', () => {
      b.id = "144151203"
      const { getBoard } = makeRules(newBoard(), RED);
      const board = getBoard();
      expect(board[0][0]).toBe(1);
      b.status = 601

    });

    it('should initialize the side', () => {
      b.id = "144151204"
      const { getSide } = makeRules(newBoard(), RED);
      const side = getSide();
      expect(side).toBe(1);
      b.status = 601

    });

    it('should find the moves from this position', () => {
      b.id = "144151205"
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
      b.id = "144151206"
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
      b.id = "144151207"
      const { getBoard } = makeRules(newBoardFromData(initialData), RED);
      const board = getBoard();
      expect(board[0][0]).toBe(0);
      b.status = 601
    });

    it('should initialize the side', () => {
      b.id = "144151208"
      const { getSide } = makeRules(newBoardFromData(initialData), RED);
      const side = getSide();
      expect(side).toBe(1);
      b.status = 601
    });

    it('should find the jumps from this position', () => {
      b.id = "144151209"
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
      b.id = "144151210"
      const { buildTree } = makeRules(newBoardFromData(initialData), RED);
      const plays = buildTree();

      expect(plays['2,0']['4,2']['6,4']['4,6']).toEqual({});
      expect(plays['2,0']['4,2']['2,4']).toEqual({});
      expect(plays['2,0']['0,2']).toEqual({});
      b.status = 601
    });
  });

  describe("play", () => {
   
    it("Make move correctly", ()  => {
      
      const {doMove,getBoard} = makeRules(newBoard(), RED)
      let move : MoveType = [[0, 0], [1,1]]
      let board = newBoardFromData([
       [ 0, 0, 1, 0, 1, 0, 1, 0 ] ,
       [ 0, 1, 0, 1, 0, 1, 0, 1 ],
       [ 1, 0, 1, 0, 1, 0, 1, 0 ],
       [ 0, 0, 0, 0, 0, 0, 0, 0 ],
       [ 0, 0, 0, 0, 0, 0, 0, 0 ],
       [ 0, -1, 0, -1, 0, -1, 0, -1 ],
       [ -1, 0, -1, 0, -1, 0, -1, 0 ],
       [ 0, -1, 0, -1, 0, -1, 0, -1 ]])

      doMove(move)
      expect(getBoard()).toEqual(board)
    })

    it("Make jump correctly", () => {
      // to perform a jump 
      // piece in position (0,2) jump to (2,4) and eat (1,3)
      const jump : MoveType =  [ [ 0, 2 ], [ 2, 4, 1, 3 ] ]
      const {doJump,getBoard} = makeRules(newBoardFromData(
        [
       [ 1, 0, 1, 0, 1, 0, 1, 0 ] ,
       [ 0, 1, 0, 1, 0, 1, 0, 1 ],
       [ 1, 0, 1, 0, 1, 0, 1, 0 ],
       [ 0, -1, 0, 0, 0, 0, 0, 0 ],
       [ 0, 0, 0, 0, 0, 0, 0, 0 ],
       [ 0, 0, 0, -1, 0, -1, 0, -1 ],
       [ -1, 0, -1, 0, -1, 0, -1, 0 ],
       [ 0, -1, 0, -1, 0, -1, 0, -1 ]]
      ), RED)

      doJump(jump)
      
      expect(getBoard()).toEqual(newBoardFromData(
        [
       [ 1, 0, 1, 0, 1, 0, 1, 0 ] ,
       [ 0, 1, 0, 1, 0, 1, 0, 1 ],
       [ 0, 0, 1, 0, 1, 0, 1, 0 ],
       [ 0, 0, 0, 0, 0, 0, 0, 0 ],
       [ 0, 0, 1, 0, 0, 0, 0, 0 ],
       [ 0, 0, 0, -1, 0, -1, 0, -1 ],
       [ -1, 0, -1, 0, -1, 0, -1, 0 ],
       [ 0, -1, 0, -1, 0, -1, 0, -1 ]]
      ))
    })

    it("Random Jump input", () => {

      const jump : MoveType =  [ [ 0, 2 ], [ 2, 4 ] ]
      const {findJumps, getBoard} = makeRules(newBoard(), RED) 
      const b = getBoard()

      const jumps = findJumps()
      expect(jumps.includes(jump)).toBe(false)
      expect(jumps.length).toBe(0)    
    })
    
    it("Random Move input", () => {

      const move : MoveType =  [ [ 2,0 ], [3, 1] ]
      const {findMoves} = makeRules(newBoard(), RED) 

      const moves = findMoves()
      expect(moves.includes(move)).toBe(false)
      expect(moves.length).toBe(7)
    })

  })
});
