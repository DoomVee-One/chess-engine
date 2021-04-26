console.log('Starting Application');
// Constants

// HTML Setup
let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
canvas.width = 20 + 8*(field_size+5) + 15;
canvas.height = canvas.width;

// Get Graphics
let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

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

// On Load -> Generate Figures
document.addEventListener('chess_load', () => {
    //Pawns
    for(let i = 0; i < 8; i++) {
        pieces.push(new Pawn(Color.WHITE, i, 1));
        pieces.push(new Pawn(Color.BLACK, i, 6));
    }
    for(let i = 0; i < 3; i++) {
        pieces.push(factory(Color.WHITE, i+1, i, 0));
        pieces.push(factory(Color.WHITE, i+1, 7-i, 0));
        pieces.push(factory(Color.BLACK, i+1, i, 7));
        pieces.push(factory(Color.BLACK, i+1, 7-i, 7));
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

    let piece = getFigure(cx, cy);
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
