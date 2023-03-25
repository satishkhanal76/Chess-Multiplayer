export class Movement {

    /**
     * One spot forward to top
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getForwardToTop(board, col, row) {
        row = row - 1;
        if(row < 0) return null;
        return [{ col, row}];
    }

    /**
     * One spot forward to bottom
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getForwardToBottom(board, col, row) {
        row = row + 1;
        if(row >= board.getRow()) return null;
        return [{col, row}];
    }

    /**
     * One spot forward to left
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getForwardToLeft(board, col, row) {
        col = col - 1;
        if(col < 0) return null;
        return [{ col, row}];
    }

    /**
     * One spot forward to right
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getForwardToRight(board, col, row) {
        col = col + 1;
        if(col >= board.getColumn()) return null;
        return [{col, row}];
    }

    /**
     * All vertical spots from piece's col to top
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getVerticalToTop(board, col, row) {
        let spots = [];
        let spot;
        for (let i = row; i >= 0; i--) {
            spot = Movement.getForwardToTop(board, col, i);
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
    static getVerticalToBottom(board, col, row) {
        let spots = [];
        let spot;
        for (let i = row; i < board.getRow(); i++) {
            spot = Movement.getForwardToBottom(board, col, i);
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
    static getHorizontalToLeft(board, col, row) {
        let spots = [];
        let spot;
        for (let i = col; i >= 0; i--) {
            spot = Movement.getForwardToLeft(board, i, row);
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
    static getHorizontalToRight(board, col, row) {
        let spots = [];
        let spot;
        for (let i = col; i < board.getColumn(); i++) {
            spot = Movement.getForwardToRight(board, i, row);
            if(!spot) break;
            spots = spots.concat(spot);
        }
        return spots;
    }

    static getTwoForwardToTop(board, col, row) {
        let spots = [];
        let spot = Movement.getForwardToTop(board, col, row);
        let moves = 1;

        while(spot && moves <= 2) {
            spots = spots.concat(spot);
            col = spot[0].col;
            row = spot[0].row;
            spot = Movement.getForwardToTop(board, col, row);
            moves = moves + 1;
        }

        return spots;
    }

    static getTwoForwardToBottom(board, col, row) {
        let spots = [];
        let spot = Movement.getForwardToBottom(board, col, row);
        let moves = 1;

        while(spot && moves <= 2) {
            spots = spots.concat(spot);
            col = spot[0].col;
            row = spot[0].row;
            spot = Movement.getForwardToBottom(board, col, row);
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
    static getOneDiagnolToTopLeft(board, col, row) {
        col = col - 1;
        row = row - 1;
        if(col < 0 || row < 0) return null;
        return [{ col, row}];
    }

    /**
     * One spot diagnol to top-right
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getOneDiagnolToTopRight(board, col, row) {
        col = col + 1;
        row = row - 1;
        if(col >= board.getColumn() || row < 0) return null;
        return [{ col, row}];
    }

    /**
     * One spot diagnol to top-right
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getOneDiagnolToBottomRight(board, col, row) {
        col = col + 1;
        row = row + 1;
        if(col >= board.getColumn() || row >= board.getRow()) return null;
        return [{ col, row}];
    }

    /**
     * One spot diagnol to top-right
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getOneDiagnolToBottomLeft(board, col, row) {
        col = col - 1;
        row = row + 1;
        if(col < 0 || row >= board.getRow()) return null;
        return [{ col, row}];
    }

    /**
     * All spots diagnol to top-left
     * @param {*} board 
     * @param {*} col 
     * @param {*} row 
     * @returns 
     */
    static getDiagnolToTopLeft(board, col, row) {
        let spots = [];
        let spot = Movement.getOneDiagnolToTopLeft(board, col, row);
        
        while(spot && spot.length > 0) {
            spots = spots.concat(spot);
            col = spot[0].col;
            row = spot[0].row;
            spot = Movement.getOneDiagnolToTopLeft(board, col, row);
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
    static getDiagnolToTopRight(board, col, row) {
        let spots = [];
        let spot = Movement.getOneDiagnolToTopRight(board, col, row);

        while(spot && spot.length > 0) {
            spots = spots.concat(spot);
            col = spot[0].col;
            row = spot[0].row;
            spot = Movement.getOneDiagnolToTopRight(board, col, row);
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
    static getDiagnolToBottomRight(board, col, row) {
        let spots = [];
        let spot = Movement.getOneDiagnolToBottomRight(board, col, row);

        while(spot && spot.length > 0) {
            spots = spots.concat(spot);
            col = spot[0].col;
            row = spot[0].row;
            spot = Movement.getOneDiagnolToBottomRight(board, col, row);
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
    static getDiagnolToBottomLeft(board, col, row) {
        let spots = [];
        let spot = Movement.getOneDiagnolToBottomLeft(board, col, row);

        while(spot && spot.length > 0) {
            spots = spots.concat(spot);
            col = spot[0].col;
            row = spot[0].row;
            spot = Movement.getOneDiagnolToBottomLeft(board, col, row);
        }

        return spots;
    }

    /**
     * Knight Unique movements
     */

    static getKnightMovement(board, col, row) {
        let spots = [];
        let spot;
        let spotCol = col;
        let spotRow = row;
        
        for (let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++) {
                if(i == 0 || j == 0) continue;
                spotCol = col + (2 * i);
                spotRow = row + (1 * j);
                if(!(spotCol < 0 || spotCol >= board.getColumn() || spotRow < 0 || spotRow >= board.getRow())) {
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
                spotCol = col + (1 * i);
                spotRow = row + (2 * j);
                if(!(spotCol < 0 || spotCol >= board.getColumn() || spotRow < 0 || spotRow >= board.getRow())) {
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