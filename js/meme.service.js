'use strict';

const MEME = 'memeDB';
const IMGSTORAGE = 'imgDB';
let gIsGarageOpen = false;
let gIsEditorOpen = false;
let gIsDownload = false;
let gMemeStorage;
let gImgStorage;

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['trump', 'president'] },
    { id: 2, url: 'img/2.jpg', keywords: ['dutch', 'paint'] },
    { id: 3, url: 'img/3.jpg', keywords: ['baby', 'cute', 'puppies'] },
    { id: 4, url: 'img/4.jpg', keywords: ['cat', 'puppies', 'cute'] },
    { id: 5, url: 'img/5.jpg', keywords: ['dogs, love'] },
    { id: 6, url: 'img/6.jpg', keywords: ['boy', 'angry'] },
    { id: 7, url: 'img/7.jpg', keywords: ['star', 'famous'] },
    { id: 8, url: 'img/8.jpg', keywords: ['baby', 'evil'] },
    { id: 9, url: 'img/9.jpg', keywords: ['haim'] },
    { id: 10, url: 'img/10.jpg', keywords: ['famous', 'told you'] },
    { id: 11, url: 'img/11.jpg', keywords: ['professor'] },
    { id: 12, url: 'img/12.jpg', keywords: ['actor', 'evil'] },
    { id: 13, url: 'img/13.jpg', keywords: ['baby', 'dance', 'happy'] },
    { id: 14, url: 'img/14.jpg', keywords: ['trump', 'president'] },
    { id: 15, url: 'img/15.jpg', keywords: ['baby, funny'] },
    { id: 16, url: 'img/16.jpg', keywords: ['dog', 'funny'] },
    { id: 17, url: 'img/17.jpg', keywords: ['obama', 'president'] },
    { id: 18, url: 'img/18.jpg', keywords: ['kiss'] },
    { id: 19, url: 'img/19.jpg', keywords: ['actor', 'handsome', 'rich', 'leo'] },
    { id: 20, url: 'img/20.jpg', keywords: ['famous', 'scary'] },
    { id: 21, url: 'img/21.jpg', keywords: ['actor, famous'] },
    { id: 22, url: 'img/22.jpg', keywords: ['actor, famous'] },
    { id: 23, url: 'img/23.jpg', keywords: ['actor, famous'] },
    { id: 24, url: 'img/24.jpg', keywords: ['putin', 'president'] },
    { id: 25, url: 'img/25.jpg', keywords: ['toystory', 'baz', 'woody'] },
];

var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: []
};

function getGallery(keyword) {
    if (keyword === '') return gImgs;
    if (gImgs.filter(img => img.keywords.includes(keyword)).length === 0) return gImgs;
    return gImgs.filter(img => img.keywords.includes(keyword))
};

function getMemeGarage() {
    gImgStorage = loadFromStorage(IMGSTORAGE)
    if (!gImgStorage) {
        gImgStorage = [];
    }
    return gImgStorage;
}

function getMeme() {
    return gMeme;
};

function getImg(memeImgId) {
    return gImgs.find(img => img.id === memeImgId);
};

function getMemeLine(lineIdx) {
    return gMeme.lines[lineIdx];
};

function getSelectedIdx() {
    return gMeme.selectedLineIdx;
}

function setMemeImgId(id) {
    gMeme.selectedImgId = +id;
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].text = txt;
}

function increaseFontSize() {
    gMeme.lines[gMeme.selectedLineIdx].size += 2;
}

function decreaseFontSize() {
    gMeme.lines[gMeme.selectedLineIdx].size -= 2;
}

function increaseStroke() {
    gMeme.lines[gMeme.selectedLineIdx].width += 1;
}

function decreaseStroke() {
    gMeme.lines[gMeme.selectedLineIdx].width -= 1;
}

function setFontColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function setStrokeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = color;
}

function switchLine() {
    gMeme.selectedLineIdx++;
    if (gMeme.selectedLineIdx > gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
}

function addNewLine() {
    let linePosY;
    let defaultTxt;
    switch (gMeme.lines.length) {
        case 0:
            linePosY = 60;
            defaultTxt = 'First line';
            break;
        case 1:
            linePosY = (gElCanvas.height - 50)
            defaultTxt = 'Second line';
            break;
        default:
            linePosY = (gElCanvas.height / 2)
            defaultTxt = 'Too many lines man...';
    }
    const newLine = {
        isDragging: false,
        pos: { x: gElCanvas.width / 2, y: linePosY },
        text: defaultTxt,
        size: 32,
        font: 'Impact',
        align: 'center',
        color: 'white',
        strokeColor: 'black',
        width: 2,
    }
    gMeme.lines.push(newLine);
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
}

function setNewFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font;
}

function resetMeme() {
    gMeme = {
        selectedImgId: 0,
        selectedLineIdx: 0,
        lines: []
    }
}

function saveMemeToStorage(data) {
    gMemeStorage.push(gMeme)
    gImgStorage.push(data)
    saveToStorage(MEME, gMemeStorage)
    saveToStorage(IMGSTORAGE, gImgStorage)
}