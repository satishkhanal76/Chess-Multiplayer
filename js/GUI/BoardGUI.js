import { BlockGUI } from "./BlockGUI.js";

export class BoardGUI {
    #game;
    #board;


    #blocks = [];

    #element;

    #clickedPiece;

    constructor(game) {
        this.#game = game;
        this.#board = game.getBoard();

        this.#element = document.getElementById("board");


        this.#createBlocks();
    }

    clicked(block) {
        let piece = this.#board.getPiece(block.getColumn(), block.getRow());

        if(this.#clickedPiece) {

            this.#game.movePiece(this.#clickedPiece.getColumn(), this.#clickedPiece.getRow(), block.getColumn(), block.getRow());

            this.#clickedPiece = null;
            this.updateBoard();
        } else {

            if(!piece) return null;
            
            this.#clickedPiece = block;
    
            let validMoves = this.#board.getValidMoves(block.getColumn(), block.getRow());
            this.showValidMoves(validMoves);
        }
    }

    showValidMoves(validMoves) {
        validMoves.forEach(move => {
            let block = this.#blocks.filter(block => move.col == block.getColumn() && move.row == block.getRow());
            block[0].showAsValidBlock();
        });
    }

    showBoard() {
        let grid = this.#board.getGrid();
        let piece;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
            
                piece = grid[i][j];
                console.log(piece);

            }
        }
    }


    #createBlocks() {
        let grid = this.#board.getGrid();
        let piece;

        let block;

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                piece = grid[i][j];

                block = new BlockGUI(j, i, this);

                this.#blocks.push(block);

                block.setText((piece) ? piece.getCharacter() : " ");

                this.#element.append(block.getElement());
            }
        }
    }

    updateBoard() {
        let grid = this.#board.getGrid();
        let piece;

        let block;

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                piece = grid[i][j];

                block = this.#blocks.filter(block => block.getColumn() == i && block.getRow() == j);
                
                block[0].setText((piece) ? piece.getCharacter() : " ");
                block[0].hideAsValidBlock();

            }
        }
    }

    showBoardOnConsole() {
        let grid = this.#board.getGrid();
        let piece;
        let output = "";
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
            
                piece = grid[j][i];
                output += (piece) ? piece.getCharacter() : " ";

            }
            output = output + "\n";
        }
        console.log(output);
    }
}