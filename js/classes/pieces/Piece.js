export class Piece {

    static COLOUR = {
        BLACK: "BLACK",
        WHITE: "WHITE"
    }

    static TYPE = {
        KING: "KING",
        QUEEN: "QUEEN",
        ROOK: "ROOK",
        BISHOP: "BISHOP",
        KNIGHT: "KNIGHT",
        PAWN: "PAWN"
    }
    
    #type;
    #character;
    #colour;
    #moves;

    #moved;
    
    constructor(type, character, colour) {
        this.#type = type;
        this.#character = character;
        this.#colour = colour;
        this.#moves = [];

        this.#moved = false;
    }

    

    getAvailableMoves(board) {
        let dimension = {
            col: board.getColumn(),
            row: board.getRow()
        };
        let piecePosition = board.getPiecePosition(this);

        
        let validSpots = [];
        
        for (let i = 0; i < this.#moves.length; i++) {
            
            const move = this.#moves[i];
            let spots = move(dimension, piecePosition);

            if(!spots) continue;
            validSpots = validSpots.concat(this.checkPathForValidSpots(board, spots));
        }
        return validSpots;
    }
    
    checkPathForValidSpots(board, spots) {
        for(let i = 0; i < spots.length; i++) {
            let spot = spots[i];
            let pieceAtTheSpot;

            pieceAtTheSpot = board.getPiece(spot);
            
            if(!pieceAtTheSpot) continue;

            // Knight can jump
            if(this.#type == Piece.TYPE.KNIGHT) {
                return this.#validateKnightSpots(board, spots);
            };
            
            if(pieceAtTheSpot.getColour() == this.getColour()) {
                return spots.splice(0, i);
            }
            
            return spots.splice(0, i + 1);
            
        }
        return spots;
    }
    
    #validateKnightSpots(board, spots) {
        for (let i = spots.length - 1; i >= 0; i--) {
            let spot = spots[i];
            let pieceAtTheSpot = board.getPiece(spot);
            
            if(!pieceAtTheSpot) continue;

            if(pieceAtTheSpot.getColour() == this.getColour()) 
                spots.splice(i, 1);
        }
        return spots;
    }

    isValidMove(player, move, board) {
        let from, to;

        from = move.getFrom();
        to = move.getTo();

        let isAvalidPosition = false;

        let availableMoves = this.getValidMoves(player, board);
        for (let i = 0; i < availableMoves.length; i++) {
            let move = availableMoves[i];
            if(move.col === to.col && move.row === to.row) isAvalidPosition = true;
        }
        return isAvalidPosition;
    }

    getValidMoves(player, board) {
        let availableMoves;
        let to;

        let piecePosition = board.getPiecePosition(this);

        availableMoves = this.getAvailableMoves(board);

        for(let i = availableMoves.length - 1; i >= 0; i--) {
            to = {
                col: availableMoves[i].col,
                row: availableMoves[i].row
            }
            
            let pieceAtTheSpot = board.getPiece(to);
            if(pieceAtTheSpot && pieceAtTheSpot.getType() === Piece.TYPE.KING) {
                availableMoves.splice(i, 1);
                continue;
            };
            
            //if this move puts king at risk than its not valid
            if(player.willMovePutInCheck(piecePosition, to)) {
                availableMoves.splice(i, 1);
            }

        };
        return availableMoves;
    }

    getAttackingPieces(board) {
        let pieces = [];
        let moves = this.getAvailableMoves(board);

        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            let piece = board.getPiece(move);
            if(piece && piece.getColour() !== this.getColour()) pieces.push(piece);
        }

        return pieces;
    }

    /**
     * This method is called whenever a piece is moved

     * @param {Object} from the position the piece moved from
     * @param {Object} to the position the piece moved to
     * @returns 
     */
    moved(from, to) {
        this.#moved = true;
    }

    hasMoved() {
        return this.#moved;
    }

    addMoves(move) {
        this.#moves.push(move);
    }

    getMoves() {
        return this.#moves;
    }
    clearMoves() {
        this.#moves = [];
    }

    getType() {
        return this.#type;
    }

    getColour() {
        return this.#colour;
    }

    getCharacter() {
        return this.#character;
    }
}