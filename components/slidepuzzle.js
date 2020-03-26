import React from 'react';
import Lib from '../lib/utils';
import Block from './block';
import ImageList from '../data/list.json';

class SlidePuzzle extends React.Component {
    constructor(props) {
        super(props)
        
        let blockCount = this.props.count || process.env.blockCount;
        if(Lib.getSquareNumber(blockCount)) {
            if(blockCount < 4) blockCount = 4;
            if(blockCount > 25) blockCount = 25;
        } else {
            blockCount = process.env.blockCount;
        }
        
        const size = this.props.size || process.env.appSize;
        var blockDivision = Math.sqrt(blockCount);
        var blocks = [];
        var pos = [];

        var blockSize = Math.round(size / blockDivision);

        var n = -1;
        for(var i = 0; i < blockCount; i++) {
            var k = i % blockDivision;
            if(k === 0) n++;
            
            const x = k * blockSize;
            const y = n * blockSize;
            
            pos.push({
                x: x,
                y: y,
                row: n,
                col: k
            })

            blocks.push({
                index: i,
                posIndex: i,
                size: blockSize,
                x: x,
                y: y,
                left: x,
                top: y,
                canvas: null,
                hide: false,
                row: n,
                col: k
            })
        }

        this.state = {
            blockCount: blockCount,
            blocks: blocks,
            blockHide: 0,
            blockHole: 0,
            blockHoleRow: 0,
            blockHoleCol: 0,
            blockPos: pos,            
            size: size,
            endGame: false,
            isTryAgain: false
        }
        
        this.initPuzzle = this.initPuzzle.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.resetPuzzle = this.resetPuzzle.bind(this);
        this.checkPuzzle = this.checkPuzzle.bind(this)
        this.clickBlock = this.clickBlock.bind(this);
        
    }
    
    componentDidMount() {
        this.initPuzzle();
    }

    resetGame() {
        this.initPuzzle();
    }

    initPuzzle() {
        
        const blocks = this.state.blocks;
        
        const img = document.createElement('img');
        const that = this;
        img.onload = function() {
            
            const canvas = document.createElement('canvas')
            canvas.width = that.state.size;
            canvas.height = that.state.size;
            
            const context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, that.state.size, that.state.size);

            const division = Math.sqrt(that.state.blockCount);
            const size = that.state.size / division;
            
            const arrange = [];
            for(var i = 0; i < that.state.blockCount; i++) {
                
                const blockCanvas = document.createElement('canvas')
                blockCanvas.width = size;
                blockCanvas.height = size;
                
                const {x, y} = blocks[i];
                arrange.push(i);

                var ctx = blockCanvas.getContext("2d");
                ctx.drawImage(canvas, x, y, size, size, 0, 0, size, size);
                
                blocks[i].canvas = blockCanvas;
            }

            const position = that.state.blockPos;
            Lib.shuffleArray(arrange);
            
            arrange.map((itemIndex,index) => {
                blocks[itemIndex].posIndex = index;
                blocks[itemIndex].left = position[index].x;
                blocks[itemIndex].top = position[index].y;
                blocks[itemIndex].row = position[index].row;
                blocks[itemIndex].col = position[index].col;
                blocks[itemIndex].hide = false;
            })

            const hiddenIndex = Lib.getRandomInt(0, that.state.blockCount - 1)
            const hiddenPos = blocks[hiddenIndex].posIndex;
            blocks[hiddenIndex].hide = true;
            const hiddenCol = blocks[hiddenIndex].col;
            const hiddenRow = blocks[hiddenIndex].row;
            
            that.setState({
                blocks: blocks,
                blockHide: hiddenIndex,
                blockHole: hiddenPos,
                blockHoleRow: hiddenRow,
                blockHoleCol: hiddenCol,
                endGame: false,
                isTryAgain: false
            })
            
        }
        img.onerror = function(err) {
            // TODO: error handler
        }
        
        // get random images from list
        img.src = '/images/' + ImageList.images[Lib.getRandomInt(0, ImageList.images.length - 1)];

    }

    clickBlock(index) {

        // check if game is finished
        if(this.state.endGame) {
            if(!this.state.isTryAgain) {
                this.setState({
                    isTryAgain: true
                })
            }
            return;
        }
        
        const blocks = this.state.blocks;
        const posindex = blocks[index].posIndex;
        const col = blocks[index].col;
        const row = blocks[index].row;
        
        let hidden = this.state.blockHole;
        let hiddenCol = this.state.blockHoleCol;
        let hiddenRow = this.state.blockHoleRow;
        
        let flagMove = false;

        // up/down
        if (row + 1 == hiddenRow && col == hiddenCol) {
            flagMove = true;
        }
        
        // down/up
        if (row - 1 == hiddenRow && col == hiddenCol) {
            flagMove = true;
        }
        
        // left/right
        if (row == hiddenRow && col + 1 == hiddenCol) {
            flagMove = true;
        }

        // left
        if (row == hiddenRow && col - 1 == hiddenCol) {
            flagMove = true;
        }

        if (flagMove) {
            const pos = this.state.blockPos[hidden];
            const x = pos.x;
            const y = pos.y;
            
            blocks[index].posIndex = hidden;
            blocks[index].left = x;
            blocks[index].top = y;
            blocks[index].row = hiddenRow;
            blocks[index].col = hiddenCol;

            hidden = posindex;
            hiddenCol = col;
            hiddenRow = row;

            const endGame = this.checkPuzzle()

            if(endGame) {
                const hideindex = this.state.blockHide;
                blocks[hideindex].posIndex = posindex;
                blocks[hideindex].left = this.state.blockPos[posindex].x;
                blocks[hideindex].top = this.state.blockPos[posindex].y;
                blocks[hideindex].row = hiddenRow;
                blocks[hideindex].col = hiddenCol;
                blocks[hideindex].hide = false;
            }

            this.setState({
                blocks: blocks,                
                blockHole: hidden,
                blockHoleCol: hiddenCol,
                blockHoleRow: hiddenRow,
                endGame: endGame
            })
        }
        
    }

    checkPuzzle() {
        const flag = this.state.blocks.some((block, index) => {
            if(!block.hide)
            {
                if(index !== block.posIndex) return true;
            }            
        })
        return (!flag);
    }

    resetPuzzle() {
        this.initPuzzle();
    }

    render() {
        
        const buttonDisplay = (this.state.endGame && this.state.isTryAgain)?'block' : 'none';
        const buttonFontSize = Math.round(10*((1.2 / 300) * this.state.size))/10;
        const backColor = (this.props.backColor)?'background-color:'+this.props.backColor:'background-image: radial-gradient(#000, #222, #666)';
        const borderColor = (this.props.borderColor)?this.props.borderColor:'#000';

        return (
            <>
            <div className="container">
                <div className="main">
                    {
                        this.state.blocks.map((item, index) => {
                            const k = item.index;
                            return (
                                <Block 
                                mode={this.state.endGame} 
                                onClick={() => this.clickBlock(index)} 
                                key={index} 
                                item={item} />
                            )
                        })
                    }
                </div>
                <button 
                onClick={this.resetPuzzle} 
                style={{ display: `${buttonDisplay}` }}>
                &#8635; Try Again
                </button>
            </div>
            <style jsx>
            {`
            .container {
                background-color: white;
                border: 1px solid ${borderColor};
                position: absolute;
                width: ${this.state.size}px;
                height: ${this.state.size}px;
                left: calc((100% - ${this.state.size}px)/2);
                top: calc((100% - ${this.state.size}px)/2);
                box-sizing: border-box;
            }
            .main {
                /*background-image: radial-gradient(#000, #222, #666);*/
                ${backColor};
                position: absolute;
                left: 0px;
                top: 0px;
                width: 100%;
                height: 100%;
                overflow: hidden;
                z-index: 1;
            }
            button {
                background-color: #000;
                border: 1px solid #222;
                position: absolute;
                left: calc((100% - 50%)/2);
                top: calc((100% - 15%)/2);
                width: 50%;
                height: 15%;
                z-index: 2;
                color: #fff;
                border-radius: 8px;
                outline: none;
                cursor: pointer;
                font-size: ${buttonFontSize}em;
                transition: 0.2s;
            }
            button:hover {
                background-color: #222;
            }
            button:active {
                background-color: #606;
                color: lightyellow;
            }
            `}
            </style>
            </>
        )
    }
}

export default SlidePuzzle;