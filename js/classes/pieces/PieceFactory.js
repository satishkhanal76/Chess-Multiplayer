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
            "type": "king",
            "character": "♚",
            "class": King,
            "FEN": 'k'
        },
        { 
            "type": "queen",
            "character": "♛",
            "class": Queen,
            "FEN": 'q'
        },
        { 
            "type": "rook",
            "character": "♜",
            "class": Rook,
            "FEN": 'r' 
        },
        { 
            "type": "bishop",
            "character": "♝",
            "class": Bishop,
            "FEN": 'b'
        },
        { 
            "type": "knight",
            "character": "♞",
            "class": Knight,
            "FEN": 'n'
        },
        { 
            "type": "pawn",
            "character": "♟︎" ,
            "class": Pawn,
            "FEN": 'p'
        }
    ],
    [Piece.COLOUR.WHITE]: [
        { 
            "type": "king",
            "character": "♔",
            "class": King,
            "FEN": 'K' 
        },
        { 
            "type": "queen",
            "character": "♕",
            "class": Queen,
            "FEN": 'Q'
        },
        { 
            "type": "rook",
            "character": "♖",
            "class": Rook,
            "FEN": 'R'
        },
        { 
            "type": "bishop",
            "character": "♗",
            "class": Bishop,
            "FEN": 'B'
        },
        { 
            "type": "knight",
            "character": "♘",
            "class": Knight,
            "FEN": 'N'
        },
        { 
            "type": "pawn",
            "character": "♙",
            "class": Pawn,
            "FEN": 'P'
        }
    ]
};

export class PieceFactory {
    
    static getPiece(pieceType, colour) {
        for (let i = 0; i < pieceData[colour].length; i++) {
            let piece = pieceData[colour][i];
            if(piece.type == pieceType) {
                return new piece.class(piece.character, colour);
            }
            
        }
    }

    static getPieceFen(fenCharacter) {
        let colour = Piece.COLOUR.WHITE;
        
        for (let i = 0; i < pieceData[colour].length; i++) {
            let piece = pieceData[colour][i];
            if(piece.FEN == fenCharacter) {
                return new piece.class(piece.character, colour);
            }
        }

        colour = Piece.COLOUR.BLACK;

        for (let i = 0; i < pieceData[colour].length; i++) {
            let piece = pieceData[colour][i];
            if(piece.FEN == fenCharacter) {
                return new piece.class(piece.character, colour);
            }
        }
        return null;
    }
}