// Enums
enum Color {
    WHITE, BLACK
}

enum Piece {
    PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING
}

// Interfaces
class ChessFigure {
    color: Color;
    piece: Piece;
    x: number;
    y: number;

    sprite: ImageBitmap;

    constructor(piece: Piece, color: Color, x: number, y: number) {
        this.piece = piece;
        this.color = color;
        this.x = x;
        this.y = y;

        this.sprite = figure[(color << 3) | piece];
    }

    mockMove = (nx: number, ny: number) => false;
    opposing = (x: number, y: number) => busy(x, y) && getFigure(x, y).color !== this.color;
    inside = (nx: number, ny: number) => (nx <= 7 && ny <= 7) && (nx >= 0 && ny >= 0);
    
    move = (nx: number, ny: number) => {
        if(this.mockMove(nx, ny)) {
            if(getFigure(nx, ny))
                destroy(getFigure(nx, ny))
            this.x = nx;
            this.y = ny;
            render();
        }
    }

    showMoves = () => {
        for(let i = 0; i < 8; i++) {
            for(let j = 0; j < 8; j++) {
                let possible = this.mockMove(i, j);
                if(possible) drawSquare(i, j, '#00ff00');
            }
        }
    }

    draw = () => ctx.drawImage(this.sprite, loc(this.x), loc(this.y), field_size, field_size);
}

class Pawn extends ChessFigure {
    constructor(color: Color, x: number, y: number) {
        super(Piece.PAWN, color, x, y);
    }

    forward = (dx: number, dy: number) => (board_orientation && dy > 0) || (!board_orientation && dy < 0);
    longMove = (nx: number, ny: number, dx: number, dy: number) => { 
        return !busy(nx, ny) && Math.abs(dy) === 2 && Math.abs(dx) === 0 && (this.y === 1 || this.y === 6);
    }
    shortMove = (nx: number, ny: number, dx: number, dy: number) => {
        return Math.abs(dy) === 1 && ((dx === 0 && !busy(nx, ny)) || (Math.abs(dx) === 1 && this.opposing(nx, ny)));
    };

    mockMove = (nx: number, ny: number) => {
        let dx = nx - this.x;
        let dy = ny - this.y;
        if((this.color === Color.WHITE && !this.forward(dx, dy) ||
            this.color === Color.BLACK && this.forward(dx, dy)) || 
            !this.inside(nx, ny))
            return false;
        if(this.shortMove(nx, ny, dx, dy) || this.longMove(nx, ny, dx, dy))
            return true;
        return false;
    }
}

class Rook extends ChessFigure {
    constructor(color: Color, x: number, y: number) {
        super(Piece.ROOK, color, x, y);
    }

    inline = (dx: number, dy: number) => (dx === 0 && dy !== 0) || (dx !== 0 && dy === 0);

    mockMove = (nx: number, ny: number) => {
        let dx = nx - this.x;
        let dy = ny - this.y;
        if(!this.inline(dx, dy)) return false;
        let k = Math.sign(dy) + Math.sign(dx);
        if(dx === 0) {
            for(let i = 1; i < Math.abs(dy); i++) {
                if(busy(nx, this.y+k*i)) return false;
            }
        } else {
            for(let i = 1; i < Math.abs(dx); i++) {
                if(busy(this.x+k*i, ny)) return false;
            }
        }
        if(busy(nx, ny) && !this.opposing(nx, ny)) return false;
        return true;
    };
}

class Knight extends ChessFigure {
    constructor(color: Color, x: number, y: number) {
        super(Piece.KNIGHT, color, x, y);
    }
    
    mockMove = (nx: number, ny: number) => {
        let dx = nx - this.x;
        let dy = ny - this.y;
        return this.inside(nx, ny) && ((Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2)) && (!busy(nx, ny) || 
                this.opposing(nx, ny));
    };
}

class Bishop extends ChessFigure {
    constructor(color: Color, x: number, y: number) {
        super(Piece.BISHOP, color, x, y);
    }
}

class Queen extends ChessFigure {
    constructor(color: Color, x: number, y: number) {
        super(Piece.QUEEN, color, x, y);
    }
}

class King extends ChessFigure {
    constructor(color: Color, x: number, y: number) {
        super(Piece.KING, color, x, y);
    }
}

function factory(color: Color, piece: number, x: number, y: number): ChessFigure | undefined {
    let map = {
        0: Pawn,
        1: Rook,
        2: Knight,
        3: Bishop,
        4: Queen,
        5: King
    };
    return map[piece](color, x, y);
}