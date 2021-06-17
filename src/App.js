import "./App.css";
import { useRef, useEffect, useState } from "react";

const MAX_WIDTH=70 // NUM_COLS
const MAX_HEIGHT=70 // NUM_ROWS

// The grid is
// ROW-MAJOR (each index is [row][column])

function App() {
    let grid = useRef(new Array(MAX_HEIGHT));
    let [ready, setReady] = useState(false);

    useEffect(()=>{
        // Assemble grid. A.k.a. "bad 2d array"
        [...Array(MAX_HEIGHT).keys()].forEach((i) => {
            grid.current[i] = new Array(MAX_WIDTH);
        });
        setReady(true);
    }, [])

    return (
        <div className="App">
            {ready?
            <div className="container" 
                style={{
                    gridTemplateColumns: `repeat(${MAX_WIDTH}, auto)`,
                    gridTemplateRows: `repeat(${MAX_HEIGHT}, auto)`,
                }}>
                {[...Array(MAX_HEIGHT).keys()].map((i) => {
                    return ([...Array(MAX_WIDTH).keys()].map((j) => {
                        return (
                            <div className="cell" key={`cell-${i}_${j}`} id={`cell-${i}_${j}`} style={{
                                    background: grid.current[i][j] ? "#434d5f" : "inherit"
                                }}>
                                &nbsp;
                            </div>
                        )
                    }))
                })}
            </div>:<div>Spinnin...</div>}
        </div>
    );
}

export default App;
