// Sprite Generation
let figure = [];
const sprite_sheet = new Image(0,0);
sprite_sheet.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Chess_Pieces_Sprite.svg/2000px-Chess_Pieces_Sprite.svg.png';

let loadEvent = new CustomEvent('chess_load');
sprite_sheet.addEventListener('load', async () => {
    for(let i = 5; i >= 0; i--) {
        figure[i] = await createImageBitmap(sprite_sheet, (5-i)*333, 0, 333, 333);
        figure[i+8] = await createImageBitmap(sprite_sheet, (5-i)*333, 333, 333, 333);
    }
    document.dispatchEvent(loadEvent);
});

// Macros
const loc = (c: number) => 20+(field_size+5)*c;
const busy = (x: number, y: number) => (getFigure(x, y) !== undefined);
const destroy = (target: ChessFigure) => pieces = pieces.filter((piece) => piece !== target);;
const getFigure = (x: number, y: number): ChessFigure | undefined => {
    for(let piece of pieces) {
        if(piece.x === x && piece.y === y) return piece;
    }
}

// Globals
let pieces = [];