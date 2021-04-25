var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
console.log('Starting Application');
// Constants
var board_orientation = true; //White - Top
var loadEvent = new CustomEvent('chess_load');
var field_size = 40;
var colorMap = { 'white': '#ccc', 'black': '#333' };
var pieces = [];
// Images
var figure = [];
var sprite_sheet = new Image(0, 0);
sprite_sheet.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Chess_Pieces_Sprite.svg/2000px-Chess_Pieces_Sprite.svg.png';
// HTML Setup
var canvas = document.getElementById('canvas');
canvas.width = 20 + 8 * (field_size + 5) + 15;
canvas.height = canvas.width;
// Get Graphics
var ctx = canvas.getContext("2d");
// Macros
var loc = function (c) { return 20 + (field_size + 5) * c; };
// Enums
var Color;
(function (Color) {
    Color[Color["WHITE"] = 0] = "WHITE";
    Color[Color["BLACK"] = 1] = "BLACK";
})(Color || (Color = {}));
var Piece;
(function (Piece) {
    Piece[Piece["PAWN"] = 0] = "PAWN";
    Piece[Piece["ROOK"] = 1] = "ROOK";
    Piece[Piece["KNIGHT"] = 2] = "KNIGHT";
    Piece[Piece["BISHOP"] = 3] = "BISHOP";
    Piece[Piece["QUEEN"] = 4] = "QUEEN";
    Piece[Piece["KING"] = 5] = "KING";
})(Piece || (Piece = {}));
// Interfaces
var ChessFigure = /** @class */ (function () {
    function ChessFigure(piece, color, x, y) {
        var _this = this;
        this.mockMove = function (nx, ny) { return false; };
        this.busy = function (x, y) { return getFigure(x, y) !== null; };
        this.opposing = function (x, y) { return getFigure(x, y) && getFigure(x, y).color !== _this.color; };
        this.inside = function (nx, ny) { return (nx <= 7 && ny <= 7) && (nx >= 0 && ny >= 0); };
        this.move = function (nx, ny) {
            if (_this.mockMove(nx, ny)) {
                if (getFigure(nx, ny))
                    getFigure(nx, ny).destroy();
                _this.x = nx;
                _this.y = ny;
                render();
            }
        };
        this.destroy = function () {
            pieces = pieces.filter(function (piece) { return piece !== _this; });
        };
        this.showMoves = function () {
            for (var i = 0; i < 8; i++) {
                for (var j = 0; j < 8; j++) {
                    var possible = _this.mockMove(i, j);
                    if (possible)
                        drawSquare(i, j, '#00ff00');
                }
            }
        };
        this.draw = function () { return ctx.drawImage(_this.sprite, loc(_this.x), loc(_this.y), field_size, field_size); };
        this.piece = piece;
        this.color = color;
        this.x = x;
        this.y = y;
        this.sprite = figure[(color << 3) | piece];
    }
    return ChessFigure;
}());
var Pawn = /** @class */ (function (_super) {
    __extends(Pawn, _super);
    function Pawn(color, x, y) {
        var _this = _super.call(this, Piece.PAWN, color, x, y) || this;
        _this.forward = function (dx, dy) { return (board_orientation && dy > 0) || (!board_orientation && dy < 0); };
        _this.longMove = function (nx, ny, dx, dy) {
            return !_this.busy(nx, ny) && Math.abs(dy) === 2 && Math.abs(dx) === 0 && (_this.y === 1 || _this.y === 6);
        };
        _this.shortMove = function (nx, ny, dx, dy) {
            return Math.abs(dy) === 1 && ((dx === 0 && !_this.busy(nx, ny)) || (Math.abs(dx) === 1 && _this.opposing(nx, ny)));
        };
        _this.mockMove = function (nx, ny) {
            var dx = nx - _this.x;
            var dy = ny - _this.y;
            if ((_this.color === Color.WHITE && !_this.forward(dx, dy) ||
                _this.color === Color.BLACK && _this.forward(dx, dy)) ||
                !_this.inside(nx, ny))
                return false;
            if (_this.shortMove(nx, ny, dx, dy) || _this.longMove(nx, ny, dx, dy))
                return true;
            return false;
        };
        return _this;
    }
    return Pawn;
}(ChessFigure));
var Rook = /** @class */ (function (_super) {
    __extends(Rook, _super);
    function Rook(color, x, y) {
        var _this = _super.call(this, Piece.ROOK, color, x, y) || this;
        _this.inline = function (dx, dy) { return (dx === 0 && dy !== 0) || (dx !== 0 && dy === 0); };
        _this.mockMove = function (nx, ny) {
            var dx = nx - _this.x;
            var dy = ny - _this.y;
            if (!_this.inline(dx, dy))
                return false;
            var k = Math.sign(dy) + Math.sign(dx);
            if (dx === 0) {
                for (var i = 1; i < Math.abs(dy); i++) {
                    if (_this.busy(nx, _this.y + k * i))
                        return false;
                }
            }
            else {
                for (var i = 1; i < Math.abs(dx); i++) {
                    if (_this.busy(_this.x + k * i, ny))
                        return false;
                }
            }
            if (_this.busy(nx, ny) && !_this.opposing(nx, ny))
                return false;
            return true;
        };
        return _this;
    }
    return Rook;
}(ChessFigure));
var Knight = /** @class */ (function (_super) {
    __extends(Knight, _super);
    function Knight(color, x, y) {
        var _this = _super.call(this, Piece.KNIGHT, color, x, y) || this;
        _this.mockMove = function (nx, ny) {
            var dx = nx - _this.x;
            var dy = ny - _this.y;
            return _this.inside(nx, ny) && ((Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2)) && (!_this.busy(nx, ny) ||
                _this.opposing(nx, ny));
        };
        return _this;
    }
    return Knight;
}(ChessFigure));
var Bishop = /** @class */ (function (_super) {
    __extends(Bishop, _super);
    function Bishop(color, x, y) {
        return _super.call(this, Piece.BISHOP, color, x, y) || this;
    }
    return Bishop;
}(ChessFigure));
var Queen = /** @class */ (function (_super) {
    __extends(Queen, _super);
    function Queen(color, x, y) {
        return _super.call(this, Piece.QUEEN, color, x, y) || this;
    }
    return Queen;
}(ChessFigure));
var King = /** @class */ (function (_super) {
    __extends(King, _super);
    function King(color, x, y) {
        return _super.call(this, Piece.KING, color, x, y) || this;
    }
    return King;
}(ChessFigure));
// Load Spritesheet
sprite_sheet.addEventListener('load', function () { return __awaiter(_this, void 0, void 0, function () {
    var i, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                i = 5;
                _e.label = 1;
            case 1:
                if (!(i >= 0)) return [3 /*break*/, 5];
                _a = figure;
                _b = i;
                return [4 /*yield*/, createImageBitmap(sprite_sheet, (5 - i) * 333, 0, 333, 333)];
            case 2:
                _a[_b] = _e.sent();
                _c = figure;
                _d = i + 8;
                return [4 /*yield*/, createImageBitmap(sprite_sheet, (5 - i) * 333, 333, 333, 333)];
            case 3:
                _c[_d] = _e.sent();
                _e.label = 4;
            case 4:
                i--;
                return [3 /*break*/, 1];
            case 5:
                document.dispatchEvent(loadEvent);
                return [2 /*return*/];
        }
    });
}); });
function drawSquare(x, y, color) {
    ctx.beginPath();
    ctx.rect(loc(x), loc(y), field_size, field_size);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}
function fillSquare(x, y, color) {
    ctx.beginPath();
    ctx.rect(loc(x), loc(y), field_size, field_size);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
// Draw Field
function drawField() {
    for (var i = 0; i < 64; i++) {
        var col = (i % 8);
        var row = Math.floor(i / 8);
        fillSquare(col, row, ((row + col) % 2 === 0) ? colorMap['white'] : colorMap['black']);
    }
    for (var i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.fillStyle = '#000';
        ctx.fillText(String.fromCharCode(65 + i), (i + 1) * (field_size + 5) - 15, 15);
        ctx.fillText(String.fromCharCode(49 + i), 10, (i + 1) * (field_size + 5) - 10);
        ctx.closePath();
    }
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function render() {
    clearCanvas();
    drawField();
    pieces.forEach(function (piece) { return piece.draw(); });
}
function getFigure(x, y) {
    for (var _i = 0, pieces_1 = pieces; _i < pieces_1.length; _i++) {
        var piece = pieces_1[_i];
        if (piece.x === x && piece.y === y) {
            return piece;
        }
    }
    return null;
}
function loadFigure(color, piece, x, y) {
    var map = {
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
document.addEventListener('chess_load', function () {
    //Pawns
    for (var i = 0; i < 8; i++) {
        pieces.push(new Pawn(Color.WHITE, i, 1));
        pieces.push(new Pawn(Color.BLACK, i, 6));
    }
    for (var i = 0; i < 3; i++) {
        pieces.push(loadFigure(Color.WHITE, i + 1, i, 0));
        pieces.push(loadFigure(Color.WHITE, i + 1, 7 - i, 0));
        pieces.push(loadFigure(Color.BLACK, i + 1, i, 7));
        pieces.push(loadFigure(Color.BLACK, i + 1, 7 - i, 7));
    }
    pieces.push(new King(Color.WHITE, 3, 0));
    pieces.push(new Queen(Color.WHITE, 4, 0));
    pieces.push(new King(Color.BLACK, 3, 7));
    pieces.push(new Queen(Color.BLACK, 4, 7));
    render();
});
var selected = null;
canvas.addEventListener('mousemove', function (e) {
    var cx = Math.floor((e.clientX - canvas.offsetLeft - 20) / (field_size + 5));
    var cy = Math.floor((e.clientY - canvas.offsetTop - 20) / (field_size + 5));
    if (selected)
        return;
    render();
    if (cx < 0 || cx > 7 || cy < 0 || cy > 7)
        return;
    var piece = getFigure(cx, cy);
    if (piece) {
        piece.showMoves();
    }
});
canvas.addEventListener('click', function (e) {
    var cx = Math.floor((e.clientX - canvas.offsetLeft - 20) / (field_size + 5));
    var cy = Math.floor((e.clientY - canvas.offsetTop - 20) / (field_size + 5));
    if (cx < 0 || cx > 7 || cy < 0 || cy > 7) {
        selected = null;
        return;
    }
    else {
        if (!selected) {
            selected = getFigure(cx, cy);
            if (selected) {
                render();
                selected.showMoves();
            }
        }
        else {
            selected.move(cx, cy);
            selected = null;
        }
    }
});
