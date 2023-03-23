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
            "class": King 
        },
        { 
            "type": "queen",
            "character": "♛",
            "class": Queen 
        },
        { 
            "type": "rook",
            "character": "♜",
            "class": Rook 
        },
        { 
            "type": "bishop",
            "character": "♝",
            "class": Bishop 
        },
        { 
            "type": "knight",
            "character": "♞",
            "class": Knight
        },
        { 
            "type": "pawn",
            "character": "♟︎" ,
            "class": Pawn
        }
    ],
    [Piece.COLOUR.WHITE]: [
        { 
            "type": "king",
            "character": "♔",
            "class": King 
        },
        { 
            "type": "queen",
            "character": "♕",
            "class": Queen
        },
        { 
            "type": "rook",
            "character": "♖",
            "class": Rook
        },
        { 
            "type": "bishop",
            "character": "♗",
            "class": Bishop
        },
        { 
            "type": "knight",
            "character": "♘",
            "class": Knight
        },
        { 
            "type": "pawn",
            "character": "♙",
            "class": Pawn
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
}