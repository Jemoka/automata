import "./App.css";
import { Component } from "react";

const MAX_WIDTH=80 // NUM_COLS
const MAX_HEIGHT=80 // NUM_ROWS
const UPDATE_MS=2000// NUM_ROWS
const RANDOM=true // random initalization
const INIT_BIRTH_RATE=0.2 // fill initalization

// The grid is
// ROW-MAJOR (each index is [row][column])

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: (new Array(MAX_HEIGHT)).fill(),
            ready: false,
            running: true,
            interval: null
        }

        this.update = this.update.bind(this);
    }

    update() {
        if (!this.state.running)
            return

        let grid = this.state.grid;

        grid.forEach((v, i) => {
            v.forEach((u, j) => {
                let nei_count = 0;
                if (i < MAX_HEIGHT-1) {
                    nei_count += grid[i+1][j] ? 1 : 0 +
                                 grid[i+1][j+1] ? 1 : 0 +
                                 grid[i+1][j-1] ? 1 : 0 
                }

                if (i > 0) {
                    nei_count += grid[i-1][j] ? 1 : 0 +
                                 grid[i-1][j+1] ? 1 : 0 +
                                 grid[i-1][j-1] ? 1 : 0 
                }

                if (j < MAX_WIDTH-1)
                    nei_count += grid[i][j+1] ? 1 : 0

                if (j > 0)
                    nei_count += grid[i][j-1] ? 1 : 0 


                // TODO generalize
                if ((nei_count > 3 || nei_count < 2) && u) 
                    grid[i][j] = false;

                if (nei_count === 3 && !u)
                    grid[i][j] = true;
            });
        });
        this.setState({grid});
    }

    componentDidMount() {
        // Assemble grid. A.k.a. "bad 2d array"
        this.state.grid.forEach((_, i) => {
            this.state.grid[i] = (new Array(MAX_WIDTH).fill()).map(() => RANDOM ? Math.random() < INIT_BIRTH_RATE : undefined);
        });
        this.setState({
            grid: this.state.grid, 
            interval: setInterval(this.update, UPDATE_MS),
            ready: true
        });
    }

    componentWillMount() {
        if (this.state.interval)
            clearInterval(this.state.interval);
    }

    render() {
        return (
        <div className="App">
            {this.state.ready?
            <div className="container" 
                style={{
                    gridTemplateColumns: `repeat(${MAX_WIDTH}, auto)`,
                    gridTemplateRows: `repeat(${MAX_HEIGHT}, auto)`,
                }}>
                {this.state.grid.map((v, i) => {
                    return (v.map((u, j) => {
                        return (
                            <div className="cell" key={`cell-${i}_${j}_${u?"f":"u"}`} id={`cell-${i}_${j}_${u?"f":"u"}`} style={{
                                    background: u ? "#434d5f" : "inherit"
                                }}
                                onClick={()=> {
                                    this.state.grid[i][j]=!this.state.grid[i][j]
                                    this.setState({grid: this.state.grid});
                                    // https://stackoverflow.com/questions/46240647/react-how-to-force-a-function-component-to-render
                                }}>
                                &nbsp;
                            </div>
                        )
                    }))
                })}
            </div>:<div>Spinnin...</div>}
            <div style={{paddingLeft: 5}} onClick={()=>this.setState({running: !this.state.running})}>{this.state.running?"Runnin":"Halttin"}</div>
        </div>
        );
    }
}

export default App;
