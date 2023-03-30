import { King } from "./King.js";
import { Queen } from "./Queen.js";
import { Rook } from "./Rook.js";
import { Bishop } from "./Bishop.js";
import { Knight } from "./Knight.js";
import { Pawn } from "./Pawn.js";

import { Piece } from "./Piece.js";

let pieceData = {
    [Piece.COLOUR.BLACK] : [
        { 
            "type": Piece.TYPE.KING,
            "character": "♚",
            "class": King,
            "FEN": 'k'
        },
        { 
            "type": Piece.TYPE.QUEEN,
            "character": "♛",
            "class": Queen,
            "FEN": 'q'
        },
        { 
            "type": Piece.TYPE.ROOK,
            "character": "♜",
            "class": Rook,
            "FEN": 'r' 
        },
        { 
            "type": Piece.TYPE.BISHOP,
            "character": "♝",
            "class": Bishop,
            "FEN": 'b'
        },
        { 
            "type": Piece.TYPE.KNIGHT,
            "character": "♞",
            "class": Knight,
            "FEN": 'n'
        },
        { 
            "type": Piece.TYPE.PAWN,
            "character": "♟︎" ,
            "class": Pawn,
            "FEN": 'p',
            "promotionRow": 7
        }
    ],
    [Piece.COLOUR.WHITE]: [
        { 
            "type": Piece.TYPE.KING,
            "character": "♔",
            "class": King,
            "FEN": 'K' 
        },
        { 
            "type": Piece.TYPE.QUEEN,
            "character": "♕",
            "class": Queen,
            "FEN": 'Q'
        },
        { 
            "type": Piece.TYPE.ROOK,
            "character": "♖",
            "class": Rook,
            "FEN": 'R'
        },
        { 
            "type": Piece.TYPE.BISHOP,
            "character": "♗",
            "class": Bishop,
            "FEN": 'B'
        },
        { 
            "type": Piece.TYPE.KNIGHT,
            "character": "♘",
            "class": Knight,
            "FEN": 'N'
        },
        { 
            "type": Piece.TYPE.PAWN,
            "character": "♙",
            "class": Pawn,
            "FEN": 'P',
            "promotionRow": 0
        }
    ]
};

export class PieceFactory {
    
    static getPiece(pieceType, colour) {
        for (let i = 0; i < pieceData[colour].length; i++) {
            let piece = pieceData[colour][i];
            if(piece.type == pieceType) {
                return new piece.class(piece, colour);
            }
            
        }
    }

    static getPieceFen(fenCharacter) {
        let colour = Piece.COLOUR.WHITE;
        
        for (let i = 0; i < pieceData[colour].length; i++) {
            let piece = pieceData[colour][i];
            if(piece.FEN == fenCharacter) {
                return new piece.class(piece, colour);
            }
        }

        colour = Piece.COLOUR.BLACK;

        for (let i = 0; i < pieceData[colour].length; i++) {
            let piece = pieceData[colour][i];
            if(piece.FEN == fenCharacter) {
                return new piece.class(piece, colour);
            }
        }
        return null;
    }
}