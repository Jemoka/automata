import "./App.css";
import { Component } from "react";

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function blendColors(colorA, colorB, amount) {
    const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
    const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
    const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
    const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
    const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
    return '#' + r + g + b;
}

const MAX_WIDTH=70 // NUM_COLS
const MAX_HEIGHT=70 // NUM_ROWS
const UPDATE_MS=50// NUM_ROWS
const RANDOM=true // random initalization
const INIT_BIRTH_RATE=0.5 // fill initalization

// The grid is
// ROW-MAJOR (each index is [row][column])

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            grid: (new Array(MAX_HEIGHT)).fill(),
            props: (new Array(MAX_HEIGHT)).fill(),
            ready: false,
            running: true,
            interval: null
        }

        this.update = this.update.bind(this);
        this.clear = this.clear.bind(this);
    }

    update() {
        if (!this.state.running)
            return

        let grid = this.state.grid;
        let props = this.state.props;

        let births = []
        let deaths = []

        grid.forEach((v, i) => {
            v.forEach((u, j) => {
                let nei_count = 0;
                let upper_left, 
                    upper_center,
                    upper_right,
                    middle_left,
                    middle_right,
                    lower_left,
                    lower_center,
                    lower_right = false;

                let [upper_left_data, 
                     upper_center_data,
                     upper_right_data,
                     middle_left_data,
                     middle_right_data,
                     lower_left_data,
                     lower_center_data,
                     lower_right_data] = ((new Array(8)).fill()).map(()=>undefined);

                // If the row number is smaller than max-height
                if (i < MAX_HEIGHT-1) {
                    lower_center = grid[i+1][j];
                    lower_left = grid[i+1][j-1];
                    lower_right = grid[i+1][j+1];

                    lower_center_data = (lower_center ? props[i+1][j] : undefined);
                    lower_left_data = (lower_left ? props[i+1][j-1] : undefined);
                    lower_right_data = (lower_right ? props[i+1][j+1] : undefined);
                }

                // If the row number is larger than 0
                if (i > 0) {
                    upper_center = grid[i-1][j];
                    upper_left = grid[i-1][j-1];
                    upper_right = grid[i-1][j+1]

                    upper_center_data = (upper_center ? props[i-1][j] : undefined);
                    upper_left_data = (upper_left ? props[i-1][j-1] : undefined);
                    upper_right_data = (upper_right ? props[i-1][j+1] : undefined);
                }

                // Otherwise...
                middle_left = grid[i][j-1];
                middle_right = grid[i][j+1];

                middle_left_data = (middle_left ? props[i][j-1] : undefined);
                middle_right_data = (middle_right ? props[i][j+1] : undefined);

                // Calculate num_neighbors
                nei_count = (upper_left ? 1 : 0) + 
                            (upper_center ? 1 : 0) + 
                            (upper_right ? 1 : 0) +
                            (middle_left ? 1 : 0) +
                            (middle_right ? 1 : 0) +
                            (lower_left ? 1 : 0) +
                            (lower_center ? 1 : 0) +
                            (lower_right  ? 1 : 0) 

                // TODO generalize
                if ((nei_count > 3 || nei_count < 2) && u) 
                    deaths.push([i,j])

                if (nei_count === 3 && !u) {
                    let data_table = [upper_left_data, 
                                      upper_center_data,
                                      upper_right_data,
                                      middle_left_data,
                                      middle_right_data,
                                      lower_left_data,
                                      lower_center_data,
                                      lower_right_data].filter(i=>i?true:false)

                    let color_blend = blendColors(
                                          blendColors(data_table[0]["color"], data_table[1]["color"], 0.5),
                                          data_table[2]["color"], 0.5);  

                    births.push([[i,j], color_blend])
                }
            });
        });
        deaths.forEach((v) => grid[v[0]][v[1]] = false);
        births.forEach((v) => {
            props[v[0][0]][v[0][1]] = {color: v[1]};
            grid[v[0][0]][v[0][1]] = true;
        });
        this.setState({grid, props});
    }

    clear() {
        if (this.state.interval)
            clearInterval(this.state.interval);

        this.state.grid.forEach((_, i) => {
            this.state.grid[i] = (new Array(MAX_WIDTH).fill()).map(() => false);
        });
        this.state.props.forEach((_, i) => {
            this.state.props[i] = (new Array(MAX_WIDTH).fill()).map(() => {
                return {color: getRandomColor()}
            });
        });
        this.setState({
            grid: this.state.grid, 
            props: this.state.props, 
            interval: setInterval(this.update, UPDATE_MS),
        });
    }

    componentDidMount() {
        // Assemble grid. A.k.a. "bad 2d array"
        this.state.grid.forEach((_, i) => {
            this.state.grid[i] = (new Array(MAX_WIDTH).fill()).map(() => RANDOM ? Math.random() < INIT_BIRTH_RATE : false);
        });
        this.state.props.forEach((_, i) => {
            this.state.props[i] = (new Array(MAX_WIDTH).fill()).map(() => {
                return {color: RANDOM ? getRandomColor() : "#434d5f"}
            });
        });
        this.setState({
            grid: this.state.grid, 
            props: this.state.props, 
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
            <div>
                <div style={{fontWeight: 700, marginBottom: 10, display: "inline-block"}}>Inheritance in Conway's Game of Life</div>
                <a style={{float: "right", marginBottom: 10, display: "inline-block", cursor: "pointer", fontWeight: "300"}} onClick={()=>this.setState({running: !this.state.running})}>{this.state.running?"Pause":"Continue"}</a>
                <a style={{float: "right", marginBottom: 10, paddingRight: 7, display: "inline-block", cursor: "pointer", fontWeight: "300"}} onClick={()=>this.clear()}>{"Clear"}</a>
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
                                    background: u ? this.state.props[i][j]["color"] : "inherit"
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
                <div style={{marginTop: 10, display: "inline-block", fontSize: 10, fontWeight: 600}}>A fun little side project by <a href="https://www.jemoka.com/">@jemoka</a></div>
                <div style={{marginTop: 10, display: "inline-block", fontSize: 10, float: "right"}}>a nice little part of <a href="https://www.sanity.gq/">sanity</a>.</div>
            </div>
        </div>
        );
    }
}

export default App;
