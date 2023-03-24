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
    
    constructor(type, character, colour) {
        this.#type = type;
        this.#character = character;
        this.#colour = colour;
        this.#moves = [];
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
                if(pieceAtTheSpot.getColour() == this.getColour()) 
                    spots.splice(i, 1);
                continue;
            };
            
            if(pieceAtTheSpot.getColour() == this.getColour()) {
                return spots.splice(0, i);
            }
            
            return spots.splice(0, i + 1);
            
        }
        return spots;
    }

    addMoves(move) {
        this.#moves.push(move);
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