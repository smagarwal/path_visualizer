import {useState } from 'react'
import pq from '../lib/ts_priority_queue'
import React from 'react';
import './App.css'

function Square({cell, handleClick, handle_wall}){

  const which_color=()=>{

    if (cell.isStart=== true){

     return 'bg-green-300'
  
    }else if(cell.isFinish=== true){
      return 'bg-red-300'

    }else if(cell.on_path=== true){
      return 'bg-orange-500'

    }else if(cell.isWall=== true){
      return 'bg-slate-950'
    
    }else if(cell.isVisited=== true){
      return 'bg-blue-900'
    
    }else if(cell.distance !== Infinity ){
      return 'bg-green-200'
    
    }else {

      return 'bg-gray-500'
    }

  }

  return (
    <>
      <button className={`border-2 border-blue-300 h-6 w-6 ${which_color()}`} 
      onClick={()=>handleClick(cell.row, cell.col) } 
      onMouseDown={()=>handle_wall(cell.row,cell.col,1)}
      onMouseEnter={()=>handle_wall(cell.row,cell.col,2)}
      onMouseUp={()=>handle_wall(cell.row,cell.col,3)}
      >

      </button>
    </>
  )

}

function Grid_render({hold_grid,handleClick, handle_wall}){

  const render_grid=hold_grid.map((a_row, row_id)=>{

    const render_row=a_row.map((a_cell,col_id)=>{

      return(
        
        <Square key = {`row_${row_id}_col_${col_id}`} cell= {a_cell}  handleClick={handleClick} handle_wall={handle_wall} />
      
  
      );
    });

    return(
      
      <div key={row_id} className="flex flex-row justify-center">

        {render_row}

      </div>
    );

  })

  return (

  

    <div className="container mx-auto">

      {render_grid}

    </div>
  
    
  );

}

function djk_algo(hold_grid, start_node, fin_node){ // notice not passing props ,instead general js variables

  const new_grid=hold_grid.slice();
  let row_len= new_grid.length;
  let col_len=new_grid[0].length;

  let min_node= {row: start_node.row, col:start_node.col};

  new_grid[start_node.row][start_node.col].distance = 0; 

  const find_min = new pq([{row: start_node.row, col: start_node.col, distance: 0}], 'distance');

  let unreachable = false; 

  while (1){

    const Visited ={row:min_node.row, col:min_node.col};
    new_grid[Visited.row][Visited.col].isVisited= true;
    const new_path=new_grid[Visited.row][Visited.col].path.slice();

    new_path.push(Visited);

    // compute the new distance of adjacent cells 

    //below

    if(Visited.row+1 < row_len && new_grid[Visited.row+1][Visited.col].isWall === false && new_grid[Visited.row+1][Visited.col].isVisited === false ){

      if(new_grid[Visited.row+1][Visited.col].distance > new_grid[Visited.row][Visited.col].distance + new_grid[Visited.row+1][Visited.col].weight){

        new_grid[Visited.row+1][Visited.col].distance = new_grid[Visited.row][Visited.col].distance + new_grid[Visited.row+1][Visited.col].weight;
 
        new_grid[Visited.row+1][Visited.col].path=new_path;

        find_min.insert({row:Visited.row+1, col: Visited.col, distance:new_grid[Visited.row+1][Visited.col].distance });

      }
    }

    //above

    if(Visited.row-1 >=0  && new_grid[Visited.row-1][Visited.col].isWall === false && new_grid[Visited.row-1][Visited.col].isVisited === false ){

      if(new_grid[Visited.row-1][Visited.col].distance > new_grid[Visited.row][Visited.col].distance + new_grid[Visited.row-1][Visited.col].weight){

        new_grid[Visited.row-1][Visited.col].distance = new_grid[Visited.row][Visited.col].distance + new_grid[Visited.row-1][Visited.col].weight;

        new_grid[Visited.row-1][Visited.col].path= new_path;
        find_min.insert({row:Visited.row-1, col: Visited.col, distance:new_grid[Visited.row-1][Visited.col].distance })
      }
    }

    //right

    if(Visited.col+1 < col_len && new_grid[Visited.row][Visited.col+1].isWall === false && new_grid[Visited.row][Visited.col+1].isVisited === false){

      if(new_grid[Visited.row][Visited.col+1].distance > new_grid[Visited.row][Visited.col].distance + new_grid[Visited.row][Visited.col+1].weight){

        new_grid[Visited.row][Visited.col+1].distance = new_grid[Visited.row][Visited.col].distance + new_grid[Visited.row][Visited.col+1].weight;

        new_grid[Visited.row][Visited.col+1].path=new_path;
        find_min.insert({row:Visited.row, col: Visited.col+1, distance:new_grid[Visited.row][Visited.col+1].distance })
      }
    }

    //left

    if(Visited.col-1 >=0 && new_grid[Visited.row][Visited.col-1].isWall === false && new_grid[Visited.row][Visited.col-1].isVisited === false){

      if(new_grid[Visited.row][Visited.col-1].distance > new_grid[Visited.row][Visited.col].distance + new_grid[Visited.row][Visited.col-1].weight){

        new_grid[Visited.row][Visited.col-1].distance = new_grid[Visited.row][Visited.col].distance + new_grid[Visited.row][Visited.col-1].weight;

        new_grid[Visited.row][Visited.col-1].path=new_path;

        find_min.insert({row:Visited.row, col: Visited.col-1, distance:new_grid[Visited.row][Visited.col-1].distance })
      }
    }

    let rec_min = null; 

    while(1){

      rec_min  = find_min.extractMin(); 
      if( rec_min === undefined){
        unreachable = true; 
        break;
      }

      //check if this is visted or not 

      if(new_grid[rec_min.row][rec_min.col].isVisited === true ){
        continue;
      }else{
        min_node.row = rec_min.row;
        min_node.col = rec_min.col;
        break;
      }
    }

    if(unreachable){
      break;
    }

    if(min_node.row == fin_node.row && min_node.col == fin_node.col){
      console.log("dest dist", new_grid[fin_node.row][fin_node.col]);
      break;
    }

  }

  return (new_grid);

}

function App() {

  let [hola, setHola] = useState("Shortest path using Dijkstra's Algorithm");
  const [reset,setReset]=useState(true);
  const [start_end, setStart_end]= useState(Array(2).fill(false));//start_end[0] indicates 'start' , [1] indicates 'end'

  const temp_node = { row: -1 , col: -1 };

  const [start_node, setStart_node] = useState(temp_node);
  const [fin_node, setFin_node] = useState(temp_node);

  const[compute_now, setCompute_now]= useState(false);
  const[draw_wall, setDraw_wall]= useState(false);

  function handle_click_compute(){

    if(start_end[0]=== true && start_end[1]=== true){

      setCompute_now(true);

    }else {

      alert('First select the start and end squares');
     
    }
    
  }

  function handle_click_draw_wall(){

    if(!draw_wall){

      setDraw_wall(true);

    }
  }


  
  // forming the grid  
  const grid_row= 30;
  const grid_col = 30 ; 

  const create_new_node =(row, col)=>{
    return { 
      row,
      col,
      isStart:false,
      isFinish:false,
      isVisited:false,
      isWall:false,
      distance: Infinity,
      weight:1,
      on_path:false,
      path:[]
    }
  }

  const initialize_grid=()=>{

    let init_grid=[];

    for(let i=0 ; i<grid_row ; ++i){

      let hold_row=[];

      for(let j=0 ; j<grid_col ; ++j){
    
        hold_row.push(create_new_node(i,j));
      }
  
      init_grid.push(hold_row);
    }

    return init_grid;

  }

  const [hold_grid,setHoldGrid]= useState(initialize_grid());


  if(compute_now){ // when getting the signal to start compuation

    setHoldGrid(djk_algo(hold_grid,start_node, fin_node));

    if(hold_grid[fin_node.row][fin_node.col].distance === Infinity){
      alert ("Finish node unreachable");
    }else {
      console.log(hold_grid[fin_node.row][fin_node.col].distance);
    }
  
    trace_path();
    setCompute_now(false);
    setDraw_wall(false);

  }

  function trace_path(){

    for(const path_node of hold_grid[fin_node.row][fin_node.col].path){

      hold_grid[path_node.row][path_node.col].on_path= true;
    }
  }

  
  //choosing the start and end node

  function handleClick(row, col){
    if(reset){

      if(!start_end[0]){

        const currStart_end = start_end.slice(0);

        currStart_end[0]=true;

        setStart_end(currStart_end);

        const newGrid = hold_grid.slice();
        newGrid[row][col].isStart = true;
        newGrid[row][col].distance = 0;
        newGrid[row][col].isWall = false;

        setHoldGrid(newGrid);

        const temp_node = { row: row , col: col };

        setStart_node(temp_node);


      }else if(!start_end[1]){

        const currStart_end = start_end.slice(0);

        currStart_end[1]=true;

        setStart_end(currStart_end);

        const newGrid = hold_grid.slice();
        newGrid[row][col].isFinish = true;
        newGrid[row][col].isWall = false;
        setHoldGrid(newGrid);

        const temp_node = { row: row , col: col };

        setFin_node(temp_node);

        setReset(false);

      }
    }

  }

  function handle_click_reset(){

    setReset(true);
    const new_start_end = [...start_end];
    new_start_end[0]=false;
    new_start_end[1]=false;

    setStart_end(new_start_end);

    const temp_node = { row: -1 , col: -1 }; // restting the start and finish nodes 
    setFin_node(temp_node);
    setStart_node(temp_node);

    setCompute_now(false); 

    setDraw_wall(false);

   setHoldGrid(initialize_grid()); 

  }

  const [Mouse_pressed, setMousepressed]= useState(false);


  function handle_wall(row, col, type){

    const wall_node = {row:row, col:col};

    if(draw_wall && !compute_now){ // allow wall only until before starting computation

      if (wall_node.row === start_node.row && wall_node.col === start_node.col ||
        wall_node.row === fin_node.row && wall_node.col === fin_node.col) {
    
        return;
      }

      if((type === 1) || (Mouse_pressed===true && type === 2)){

        //mouse is down or mouse is enetered after down
  
        const newGrid = hold_grid.slice();
        newGrid[row][col].isWall = true;
        setHoldGrid(newGrid);
        setMousepressed(true);
  
      }else if (Mouse_pressed===true && type === 3){
  
        //mouse is Up
        const newGrid = hold_grid.slice();
        newGrid[row][col].isWall = true;
        setHoldGrid(newGrid);
  
        setMousepressed(false);
      }

    }

  }

  return (
    <div className='flex flex-col items-center'>

      <div className='container mx-auto text-center'>
  
        <h1 className="text-3xl font-bold ">
          {hola}
        </h1>

        <h1 className="text-xl my-1">
          Click on a single cell to first select a Start node and then an End node from the grid.
        </h1>

        <h1 className="text-xl my-1">
        To add walls, press Draw Wall then click and drag on the grid.
        </h1>

      
        <div className='flex flex-row justify-center my-5'>

          <button className='border-2 px-4 py-2 bg-red-500 text-white mx-2 hover:bg-red-800' onClick={()=>handle_click_reset()}>
            Reset
          </button>

          <button className='border-2 px-4 py-2 bg-green-500 text-white mx-2 hover:bg-green-800' onClick={()=>handle_click_compute()}>
            Compute Path 
          </button>

          <button className='border-2 px-4 py-2 bg-orange-500 text-white mx-2 hover:bg-orange-800' onClick={()=>handle_click_draw_wall()}>
            Draw Wall
          </button>
        </div>
      </div>
      
      <Grid_render hold_grid={hold_grid}  handleClick= {handleClick} handle_wall={handle_wall} />
       
    </div>
  )

}

export default App
