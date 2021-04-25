console.log('Starting Application');
// Constants
let board_orientation: boolean = true; //White - Top
let loadEvent = new CustomEvent('chess_load');
const field_size = 40;
const colorMap = { 'white': '#ccc', 'black': '#333' };
let pieces = [];

// Images
let figure = [];
const sprite_sheet = new Image(0,0);
sprite_sheet.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Chess_Pieces_Sprite.svg/2000px-Chess_Pieces_Sprite.svg.png';

// HTML Setup
let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
canvas.width = 20 + 8*(field_size+5) + 15;
canvas.height = canvas.width;

// Get Graphics
let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

// Macros
const loc = (c: number) => 20+(field_size+5)*c;


// Enums
enum Color {
    WHITE, BLACK
}

enum Piece {
    PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING
}

// Interfaces
abstract class ChessFigure {
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
    busy = (x: number, y: number) => getFigure(x, y) !== null;
    opposing = (x: number, y: number) => getFigure(x, y) && getFigure(x, y).color !== this.color;
    inside = (nx: number, ny: number) => (nx <= 7 && ny <= 7) && (nx >= 0 && ny >= 0);
    
    move = (nx: number, ny: number) => {
        if(this.mockMove(nx, ny)) {
            if(getFigure(nx, ny))
                getFigure(nx, ny).destroy()
            this.x = nx;
            this.y = ny;
            render();
        }
    }

    destroy = () => {
        pieces = pieces.filter((piece) => piece !== this);
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
        return !this.busy(nx, ny) && Math.abs(dy) === 2 && Math.abs(dx) === 0 && (this.y === 1 || this.y === 6);
    }
    shortMove = (nx: number, ny: number, dx: number, dy: number) => {
        return Math.abs(dy) === 1 && ((dx === 0 && !this.busy(nx, ny)) || (Math.abs(dx) === 1 && this.opposing(nx, ny)));
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
                if(this.busy(nx, this.y+k*i)) return false;
            }
        } else {
            for(let i = 1; i < Math.abs(dx); i++) {
                if(this.busy(this.x+k*i, ny)) return false;
            }
        }
        if(this.busy(nx, ny) && !this.opposing(nx, ny)) return false;
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
        return this.inside(nx, ny) && ((Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2)) && (!this.busy(nx, ny) || 
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

// Load Spritesheet
sprite_sheet.addEventListener('load', async () => {
    for(let i = 5; i >= 0; i--) {
        figure[i] = await createImageBitmap(sprite_sheet, (5-i)*333, 0, 333, 333);
        figure[i+8] = await createImageBitmap(sprite_sheet, (5-i)*333, 333, 333, 333);
    }
    document.dispatchEvent(loadEvent);
});

function drawSquare(x: number, y: number, color: string): void {
    ctx.beginPath();
    ctx.rect(loc(x), loc(y), field_size, field_size);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}
function fillSquare(x: number, y: number, color: string): void {
    ctx.beginPath();
    ctx.rect(loc(x), loc(y), field_size, field_size);
    ctx.fillStyle= color;
    ctx.fill();
    ctx.closePath();
}

// Draw Field
function drawField(): void {
    for(let i = 0; i < 64; i++) {
        let col = (i % 8);
        let row = Math.floor(i / 8);
        fillSquare(col, row, ((row+col) % 2 === 0) ? colorMap['white'] : colorMap['black']);
    }

    for(let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.fillText(String.fromCharCode(65+i), (i+1)*(field_size+5)-15, 15);
        ctx.fillText(String.fromCharCode(49+i), 10, (i+1)*(field_size+5)-10);
        ctx.closePath();
    }
}

function clearCanvas(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function render(): void {
    clearCanvas();
    drawField();
    pieces.forEach(piece => piece.draw());
}

function getFigure(x: number, y: number): ChessFigure | null {
    for(let piece of pieces) {
        if(piece.x === x && piece.y === y) {
            return piece;
        }
    }
    return null;
}

function loadFigure(color: Color, piece: number, x: number, y: number): ChessFigure | undefined {
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

// On Load -> Generate Figures
document.addEventListener('chess_load', () => {
    //Pawns
    for(let i = 0; i < 8; i++) {
        pieces.push(new Pawn(Color.WHITE, i, 1));
        pieces.push(new Pawn(Color.BLACK, i, 6));
    }
    for(let i = 0; i < 3; i++) {
        pieces.push(loadFigure(Color.WHITE, i+1, i, 0));
        pieces.push(loadFigure(Color.WHITE, i+1, 7-i, 0));
        pieces.push(loadFigure(Color.BLACK, i+1, i, 7));
        pieces.push(loadFigure(Color.BLACK, i+1, 7-i, 7));
    }
    pieces.push(new King(Color.WHITE, 3, 0));
    pieces.push(new Queen(Color.WHITE, 4, 0));
    pieces.push(new King(Color.BLACK, 3, 7));
    pieces.push(new Queen(Color.BLACK, 4, 7));

    render();
});


let selected: ChessFigure | null = null;
canvas.addEventListener('mousemove', (e: MouseEvent) => {
    let cx = Math.floor((e.clientX - canvas.offsetLeft - 20)/(field_size+5));
    let cy = Math.floor((e.clientY - canvas.offsetTop - 20)/(field_size+5));

    if(selected) return;
    render();
    if(cx < 0 || cx > 7 || cy < 0 || cy > 7) return;

    let piece = getFigure(cx,cy);
    if(piece) {
        piece.showMoves();
    }
});

canvas.addEventListener('click', (e: MouseEvent) => {
    let cx = Math.floor((e.clientX - canvas.offsetLeft - 20)/(field_size+5));
    let cy = Math.floor((e.clientY - canvas.offsetTop - 20)/(field_size+5));

    if(cx < 0 || cx > 7 || cy < 0 || cy > 7) {
        selected = null;
        return;
    } else {
        if(!selected) {
            selected = getFigure(cx, cy);
            if(selected) {
                render();
                selected.showMoves();
            }
        } else {
            selected.move(cx, cy);
            selected = null;
        }
    }
});
