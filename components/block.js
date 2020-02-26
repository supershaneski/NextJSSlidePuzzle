import React from 'react';

export default class Block extends React.Component {
    constructor(props) {
        super(props)
        this.canvas = React.createRef()
    }
    componentDidMount() {
        const canvas = document.createElement('canvas');
        canvas.width = this.props.item.size;
        canvas.height = this.props.item.size;
        this.canvas.appendChild(canvas)
    }
    render() {
        const mode = this.props.mode;
        const cursor = (mode)?'default':'pointer';
        const item = this.props.item;
        
        if(item.canvas && this.canvas.childNodes.length > 0) {
            const ctx = this.canvas.childNodes[0].getContext('2d');
            ctx.drawImage(item.canvas, 0, 0);
        }

        const display = (item.hide)?'none':'block';
        
        return (
            <>
            <div onClick={() => this.props.onClick(item.index)} ref={(el) => this.canvas = el} />
            <style jsx>
                {`
                div {
                    position: absolute;
                    left: ${item.left}px;
                    top: ${item.top}px;
                    width: ${item.size}px;
                    height: ${item.size}px;
                    box-sizing: border-box;
                    cursor: ${cursor};
                    display: ${display};
                    transition: 0.2s;
                }
                `}
            </style>
            </>        
        )
    }
}
