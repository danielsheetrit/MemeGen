'use strict';

var gElCanvas;
var gCtx;

function init() {
    gElCanvas = document.querySelector('.canvas-sheet')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    renderGallery('');
}

function renderGallery(keyword) {
    const galleryContainer = document.querySelector('.gallery-container')
    const gallery = getGallery(keyword)
    const strHtmls = gallery.map(img => {
        return `
        <div class="item-${img.id}">
            <img data-id="${img.id}" data-desc="${img.keywords}" src="${img.url}" alt="meme" 
            onclick="onSelectImg(this)"
            style="max-width: 150px;">
        </div>`;
    });
    galleryContainer.innerHTML = strHtmls.join('')
}

function renderMemeGarage() {
    const memeGarageContainer = document.querySelector('.garage-container')
    const memeGarage = getMemeGarage()
    const defaultMsg = `<h1>No memes available.</h1>`

    if(!memeGarage.length) {
        memeGarageContainer.innerHTML = defaultMsg;
        return
    } 
}

function renderCanvas() {
    const currImg = getImg(gMeme.selectedImgId);
    var elImg = new Image()
    elImg.src = `${currImg.url}`;
    // img larger then 820px wide, are not supported.
    if (elImg.width > 820) {
        alert('image size not supported')
        return
    }
    elImg.onload = () => {
        // fiting img to window size.
        resizeImg(elImg)
        // fitting canvas to the selected image.
        resizeCanvas(gElCanvas, elImg);
        // fitting canvas container to canvas size.
        resizeCanvasContainer();
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
        //render the text
        renderMemeText();
    }
}

function renderMemeText() {
    const meme = getMeme()
    meme.lines.forEach(line => {
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.lineWidth = `${line.width}`
        gCtx.strokeStyle = `${line.strokeColor}`
        gCtx.fillStyle = `${line.color}`
        gCtx.textAlign = `${line.align}`
        gCtx.fillText(line.text, line.pos.x, line.pos.y)
        gCtx.strokeText(line.text, line.pos.x, line.pos.y)
        //render Rect to the current line.
        if (meme.lines[meme.selectedLineIdx] !== line) return
        // if (gIsDownload) return
        const lineWidth = gCtx.measureText(line.text).width
        gCtx.strokeRect(line.pos.x - (lineWidth / 2) - 8, line.pos.y + 5, lineWidth + 15, -(line.size + 3))
    });
}

function onGallerySearch(keyword) {
    renderGallery(keyword);
}

function onSelectImg(elGalleryImg) {
    const galleryImgId = elGalleryImg.getAttribute('data-id')
    //update model
    setMemeImgId(galleryImgId)
    //update DOM
    renderCanvas()
    //change display
    gIsEditorOpen = true
    onChangeDisplay()
}

function onOpenMemeGarage() {
    gIsGarageOpen = true
    gIsEditorOpen = false
    renderMemeGarage()
    onChangeDisplay()
}

function onTextInput(elTxtInput) {
    //update model
    setLineTxt(elTxtInput.value)
    //update DOM
    renderCanvas()
}

function onChangeDisplay() {
    const elGallery = document.querySelector('.gallery-container')
    const elMemeEditor = document.querySelector('.meme-editor')
    const elHero = document.querySelector('.hero-container')
    const elSearchBox = document.querySelector('.search-container')
    const elMemeGarage = document.querySelector('.garage-container')

    if (gIsEditorOpen) {
        elGallery.classList.add('non-active')
        elHero.classList.add('non-active')
        elSearchBox.classList.add('non-active')
        elMemeEditor.classList.add('active')
    } else if (gIsGarageOpen) {
        elGallery.classList.add('non-active')
        elHero.classList.add('non-active')
        elSearchBox.classList.add('non-active')
        elMemeEditor.classList.remove('active')
        elMemeGarage.classList.add('active')
    } else {
        elGallery.classList.remove('non-active')
        elHero.classList.remove('non-active')
        elSearchBox.classList.remove('non-active')
        elMemeEditor.classList.remove('active')
        elMemeGarage.classList.remove('active')
    }
}

function onIncreaseFontSize() {
    //update model
    increaseFontSize()
    //update DOM
    renderCanvas()
}

function onDecreaseFontSize() {
    //update model
    decreaseFontSize()
    //update DOM
    renderCanvas()
}

function onSwitchLines() {
    //update model
    switchLine()
    //update DOM
    const elTxtInput = document.querySelector('.txt-input')
    if (!gMeme.lines.length) {
        elTxtInput.value = ''
        return
    }
    elTxtInput.value = gMeme.lines[gMeme.selectedLineIdx].text
    renderCanvas();
}

function onAddNewLine() {
    addNewLine()
    onSwitchLines()
    renderCanvas()
}

function onRemoveLine() {
    removeLine()
    onSwitchLines()
    renderCanvas()
}

function onChangeFont(font) {
    setNewFont(font)
    renderCanvas()
}

function onIncreaseStroke() {
    increaseStroke()
    renderCanvas()
}

function onDecreaseStroke() {
    decreaseStroke()
    renderCanvas()
}

function onFontColorPick(color) {
    setFontColor(color)
    renderCanvas()
}

function onStrokeColorPick(color) {
    setStrokeColor(color)
    renderCanvas()
}

function resizeCanvas(elCanvas, elImg) {
    elCanvas.width = elImg.width
    elCanvas.height = elImg.height
}

function resizeCanvasContainer() {
    const elContainer = document.querySelector('.canvas-container')
    elContainer.style.width = `${gElCanvas.width}px`
    elContainer.style.height = `${gElCanvas.height}px`
}

function onOpenGallry() {
    //reset DOM
    gIsEditorOpen = false
    gIsGarageOpen = false
    //reset Model
    resetMeme()
    onChangeDisplay()
}

function resizeImg(elImg) {
    if (window.innerWidth < 1100) {
        if (elImg.width - elImg.height === 0) {
            elImg.width = 500
            elImg.height = 500
        } else if (elImg.width > elImg.height || elImg.width < elImg.height) {
            elImg.width = elImg.width / 1.5
            elImg.height = elImg.height / 1.5
        }
    }
    if (window.innerWidth < 840) {
        if (elImg.width < 370) return
        if (elImg.width - elImg.height === 0) {
            elImg.width = 350
            elImg.height = 350
        } else if (elImg.width > elImg.height || elImg.width < elImg.height) {
            elImg.width = elImg.width / 1.5
            elImg.height = elImg.height / 1.5
        }
    }
    if (window.innerWidth < 640) {
        if (elImg.width < 370) return
        if (elImg.width - elImg.height === 0) {
            elImg.width = 300
            elImg.height = 300
        } else if (elImg.width > elImg.height || elImg.width < elImg.height) {
            elImg.width = elImg.width / 1.5
            elImg.height = elImg.height / 1.5
        }
    }
}

function onDownloadMeme(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-meme.jpg'
}

function onSaveMeme() {
    const data = gElCanvas.toDataURL()
    saveMemeToStorage(data);
}