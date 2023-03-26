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
        let piecePosition = board.getPiecePosition(this);
        let validSpots = [];

        for (let i = 0; i < this.#moves.length; i++) {
            const move = this.#moves[i];
            let spots = move(board, piecePosition.col, piecePosition.row);
            if(!spots) continue;
            validSpots = validSpots.concat(this.checkPathForValidSpots(board, spots));
        }
        return validSpots;
    }
    
    checkPathForValidSpots(board, spots) {
        for(let i = 0; i < spots.length; i++) {
            let spot = spots[i];
            let pieceAtTheSpot = board.getPiece(spot.col, spot.row);
            
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
            let pieceAtTheSpot = board.getPiece(spot.col, spot.row);
            
            if(!pieceAtTheSpot) continue;

            if(pieceAtTheSpot.getColour() == this.getColour()) 
                spots.splice(i, 1);
        }
        return spots;
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