'use strict';

const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
let gStartPos;

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        if (!gIsEditorOpen) return
        renderCanvas()
    })
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function onDown(ev) {
    if (gMeme.lines.length === 0) return
    const pos = getEvPos(ev)
    if (!isLineClicked(pos)) return
    gMeme.lines[gMeme.selectedLineIdx].isDragging = true
    gStartPos = pos
    gElCanvas.style.cursor = 'grabbing'
}

function onMove(ev) {
    if (gMeme.lines.length === 0) return
    if (gMeme.lines[gMeme.selectedLineIdx].isDragging) {
        const pos = getEvPos(ev)
        const diffX = pos.x - gStartPos.x
        const diffY = pos.y - gStartPos.y

        gMeme.lines[gMeme.selectedLineIdx].pos.x += diffX
        gMeme.lines[gMeme.selectedLineIdx].pos.y += diffY

        gStartPos = pos
        renderCanvas()
    }
}

function onUp() {
    if (gMeme.lines.length === 0) return
    gMeme.lines[gMeme.selectedLineIdx].isDragging = false
    gElCanvas.style.cursor = 'grab'
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
        }
    }
    return pos
}

function isLineClicked(clickedPos) {
    //line width and height from the center point.
    const lineHeight = gMeme.lines[gMeme.selectedLineIdx].size
    const currTxt = gMeme.lines[gMeme.selectedLineIdx].text
    const lineWidth = gCtx.measureText(currTxt).width

    const pos = gMeme.lines[gMeme.selectedLineIdx].pos

    const distanceX = Math.sqrt((pos.x - clickedPos.x) ** 2)
    const distanceY = Math.sqrt((pos.y - clickedPos.y) ** 2)

    //dividing linewidth by 2, we want the size relative to each side(left, right).
    if (distanceX <= (lineWidth / 2) && distanceY <= lineHeight) {
        return true
    } else {
        return false
    }
}