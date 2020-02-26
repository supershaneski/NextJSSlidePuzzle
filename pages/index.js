import React from 'react';
import SlidePuzzle from '../components/slidepuzzle';

class Clock extends React.Component {
    constructor() {
        super()
        this.timer = null;
        this.state = {
            time: new Date()
        }
    }
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({
                time: new Date()
            })
        }, 1000)
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    render() {
        return (
            <>
            <span>
            { this.state.time.toLocaleTimeString() }
            </span>
            <style jsx>
                {`
                span {
                    color: #ccc; /*#dedede;*/
                }
                `}
            </style>
            </>
        )
    }
}

const appLoader = (containerElement) => {
    return {
        width: containerElement.offsetWidth,
        height: containerElement.offsetHeight
    }
}

class Index extends React.Component {
    constructor(props) {
        super(props)
        this.appContainer = React.createRef();
        this.state = {
            size: 0
        }
    }
    componentDidMount() {
        const result = appLoader(this.appContainer)
        this.setState({
            size: (result.width > result.height)?result.height:result.width
        })
    }
    render() {
        const size = this.state.size;
        return (
            <>
            <div ref={el => this.appContainer = el}>
            {
                size &&
                <SlidePuzzle size={size} count={9} />
            }
            </div>
            <Clock />
            <style jsx>
                {`
                div {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                }
                `}
            </style>
            </>
        )
    }
}

export default Index;