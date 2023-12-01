export class Movement {

    /**
     * One spot forward to top
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getForwardToTop(dimension, piecePosition) {
        let position = {
            col: piecePosition.col,
            row: piecePosition.row - 1
        }
        if(position.row < 0) return null;
        return [position];
    }

    /**
     * One spot forward to bottom
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getForwardToBottom(dimension, piecePosition) {
        let position = {
            col: piecePosition.col,
            row: piecePosition.row + 1
        }
        if(position.row >= dimension.row) return null;
        return [position];
    }

    /**
     * One spot forward to left
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getForwardToLeft(dimension, piecePosition) {
        let position = {
            col: piecePosition.col - 1,
            row: piecePosition.row
        }
        if(position.col < 0) return null;
        return [position];
    }

    /**
     * One spot forward to right
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getForwardToRight(dimension, piecePosition) {
        let position = {
            col: piecePosition.col + 1,
            row: piecePosition.row
        }
        if(position.col >= dimension.col) return null;
        return [position];
    }

    /**
     * All vertical spots from piece's col to top
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getVerticalToTop(dimension, piecePosition) {
        let position = {
            col: piecePosition.col,
            row: piecePosition.row
        };

        let spots = [];
        let spot;
        for (let i = piecePosition.row; i >= 0; i--) {
            position.row = i;
            spot = Movement.getForwardToTop(dimension, position);
            if(!spot) break;
            spots = spots.concat(spot);
        }
        return spots;
    }

    /**
     * All vertical spots from piece's col to bottom
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getVerticalToBottom(dimension, piecePosition) {
        let position = {
            col: piecePosition.col,
            row: piecePosition.row
        };

        let spots = [];
        let spot;
        for (let i = piecePosition.row; i < dimension.row; i++) {
            position.row = i;
            spot = Movement.getForwardToBottom(dimension, position);
            if(!spot) break;
            spots = spots.concat(spot);
        }
        return spots;
    }

    /**
     * All horizontal spots from piece's row to left
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getHorizontalToLeft(dimension, piecePosition) {
        let position = {
            col: piecePosition.col,
            row: piecePosition.row
        };

        let spots = [];
        let spot;
        for (let i = piecePosition.col; i >= 0; i--) {
            position.col = i;
            spot = Movement.getForwardToLeft(dimension, position);
            if(!spot) break;
            spots = spots.concat(spot);
        }
        return spots;
    }

    /**
     * All horizontal spots from piece's row to right
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getHorizontalToRight(dimension, piecePosition) {
        let position = {
            col: piecePosition.col,
            row: piecePosition.row
        };
        let spots = [];
        let spot;
        for (let i = piecePosition.col; i < dimension.col; i++) {
            position.col = i;
            spot = Movement.getForwardToRight(dimension, position);
            if(!spot) break;
            spots = spots.concat(spot);
        }
        return spots;
    }

    static getTwoForwardToTop(dimension, piecePosition) {
        let position = {
            col: piecePosition.col,
            row: piecePosition.row
        };

        let spots = [];
        let spot = Movement.getForwardToTop(dimension, position);
        let moves = 1;

        while(spot && moves <= 2) {
            spots = spots.concat(spot);
            position.col = spot[0].col;
            position.row = spot[0].row;
            spot = Movement.getForwardToTop(dimension, position);
            moves = moves + 1;
        }

        return spots;
    }

    static getTwoForwardToBottom(dimension, piecePosition) {
        let position = {
            col: piecePosition.col,
            row: piecePosition.row
        };

        let spots = [];
        let spot = Movement.getForwardToBottom(dimension, position);
        let moves = 1;

        while(spot && moves <= 2) {
            spots = spots.concat(spot);
            position.col = spot[0].col;
            position.row = spot[0].row;
            spot = Movement.getForwardToBottom(dimension, position);
            moves = moves + 1;
        }

        return spots;
    }


    /**
     * Diagnol movements
     */


    /**
     * One spot diagnol to top-left
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getOneDiagnolToTopLeft(dimension, piecePosition) {
        let position = {
            col: piecePosition.col - 1,
            row: piecePosition.row - 1
        };

        if(position.col < 0 || position.row < 0) return null;
        return [position];
    }

    /**
     * One spot diagnol to top-right
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getOneDiagnolToTopRight(dimension, piecePosition) {
        let position = {
            col: piecePosition.col + 1,
            row: piecePosition.row - 1
        };
        if(position.col >= dimension.col || position.row < 0) return null;
        return [position];
    }

    /**
     * One spot diagnol to top-right
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getOneDiagnolToBottomRight(dimension, piecePosition) {
        let position = {
            col: piecePosition.col + 1,
            row: piecePosition.row + 1
        };

        if(position.col >= dimension.col || position.row >= dimension.row) return null;
        return [position];
    }

    /**
     * One spot diagnol to top-right
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getOneDiagnolToBottomLeft(dimension, piecePosition) {
        let position = {
            col: piecePosition.col - 1,
            row: piecePosition.row + 1
        };

        if(position.col < 0 || position.row >= dimension.row) return null;
        return [position];
    }

    /**
     * All spots diagnol to top-left
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getDiagnolToTopLeft(dimension, piecePosition) {
        let position = {
            col: piecePosition.col,
            row: piecePosition.row
        };

        let spots = [];
        let spot = Movement.getOneDiagnolToTopLeft(dimension, position);
        
        while(spot && spot.length > 0) {
            spots = spots.concat(spot);
            position.col = spot[0].col;
            position.row = spot[0].row;
            spot = Movement.getOneDiagnolToTopLeft(dimension, position);
        }

        return spots;
    }

    /**
     * All spots diagnol to top-right
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getDiagnolToTopRight(dimension, piecePosition) {
        let position = {
            col: piecePosition.col,
            row: piecePosition.row
        };

        let spots = [];
        let spot = Movement.getOneDiagnolToTopRight(dimension, position);

        while(spot && spot.length > 0) {
            spots = spots.concat(spot);
            position.col = spot[0].col;
            position.row = spot[0].row;
            spot = Movement.getOneDiagnolToTopRight(dimension, position);
        }

        return spots;
    }

    /**
     * All spots diagnol to top-right
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getDiagnolToBottomRight(dimension, piecePosition) {
        let position = {
            col: piecePosition.col,
            row: piecePosition.row
        };

        let spots = [];
        let spot = Movement.getOneDiagnolToBottomRight(dimension, position);

        while(spot && spot.length > 0) {
            spots = spots.concat(spot);
            position.col = spot[0].col;
            position.row = spot[0].row;
            spot = Movement.getOneDiagnolToBottomRight(dimension, position);
        }

        return spots;
    }

    /**
     * All spots diagnol to top-right
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getDiagnolToBottomLeft(dimension, piecePosition) {
        let position = {
            col: piecePosition.col,
            row: piecePosition.row
        };
        let spots = [];
        let spot = Movement.getOneDiagnolToBottomLeft(dimension, position);

        while(spot && spot.length > 0) {
            spots = spots.concat(spot);
            position.col = spot[0].col;
            position.row = spot[0].row;
            spot = Movement.getOneDiagnolToBottomLeft(dimension, position);
        }

        return spots;
    }

    /**
     * Knight Unique movements
     */

    static getKnightMovement(dimension, piecePosition) {
        let spots = [];
        let spot;
        let spotCol = piecePosition.col;
        let spotRow = piecePosition.row;
        
        for (let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++) {
                if(i == 0 || j == 0) continue;
                spotCol = piecePosition.col + (2 * i);
                spotRow = piecePosition.row + (1 * j);
                if(!(spotCol < 0 || spotCol >= dimension.col || spotRow < 0 || spotRow >= dimension.row)) {
                    spot = {
                        col: spotCol,
                        row: spotRow
                    };
                    spots.push(spot);
                }
            }
        }

        for (let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++) {
                if(i == 0 || j == 0) continue;
                spotCol = piecePosition.col + (1 * i);
                spotRow = piecePosition.row + (2 * j);
                if(!(spotCol < 0 || spotCol >= dimension.col || spotRow < 0 || spotRow >= dimension.row)) {
                    spot = {
                        col: spotCol,
                        row: spotRow
                    };
                    spots.push(spot);
                }
            }
        }

        return spots;
    }
}