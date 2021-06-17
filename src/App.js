import "./App.css";
import { useEffect, useState, useReducer } from "react";

const MAX_WIDTH=80 // NUM_COLS
const MAX_HEIGHT=80 // NUM_ROWS

// The grid is
// ROW-MAJOR (each index is [row][column])

function App() {
    let [grid, setGrid] = useState((new Array(MAX_HEIGHT)).fill());
    let [ready, setReady] = useState(false);
    const [_, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(()=>{
        // Assemble grid. A.k.a. "bad 2d array"
        grid.forEach((_, i) => {
            grid[i] = (new Array(MAX_WIDTH)).fill();
        });
        setReady(true);
        setGrid(grid);
    }, [grid])

    return (
        <div className="App">
            {ready?
            <div className="container" 
                style={{
                    gridTemplateColumns: `repeat(${MAX_WIDTH}, auto)`,
                    gridTemplateRows: `repeat(${MAX_HEIGHT}, auto)`,
                }}>
                {grid.map((v, i) => {
                    return (v.map((u, j) => {
                        return (
                            <div className="cell" key={`cell-${i}_${j}_${u?"f":"u"}`} id={`cell-${i}_${j}_${u?"f":"u"}`} style={{
                                    background: u ? "#434d5f" : "inherit"
                                }}
                                onClick={()=> {
                                    grid[i][j]=!grid[i][j]
                                    setGrid(grid);
                                    forceUpdate();
                                    // https://stackoverflow.com/questions/46240647/react-how-to-force-a-function-component-to-render
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
