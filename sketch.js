var rows = 40;
var cols = 40;
var grid = new Array(cols);
var openSet = []; //stuff you're yet to visit
var closedSet = []; //stuff you've already visited
var start; //begin here
var end; //this is your destination
var w,h; //this is for scaling stuff out properly. Width and height
var path = []; //array. this will store the final path


function removeFromArray(arr,elt)
{
  for(var i = arr.length-1;i>=0;i--)
  {
    if(arr[i]==elt)
    {
      arr.splice(i,1);
    }
  }
}

function heuristic(a,b)
{
  //var d = abs(a.i-b.i)+abs(a.j-b.j); //Manhattan distance
  var d = dist(a.i,a.j,b.i,b.j); //Euclidean distance
  return d;
}

//making an object
function Spot(i,j){

  this.i=i
  this.j=j
  this.f=0; //cost function, f = g + h
  this.g=0; //dist from starting point
  this.h=0; //heuristics, estimated distance from destination
  this.neighbours = []; //every spot will keep track of its neighbours
  this.previous = undefined;
  this.wall = false; //boolean value. Is the cell an obstacle? Or no?
  if(random(1)<0.3)//change obstacle probability here
  {
    this.wall = true; //Randomly generates obstacle
  }

  this.addNeighbours = function(grid){ // function to add neighbour spots to the neigbours array
    var i = this.i;
    var j = this.j;
    if(i<cols-1)
    {
    this.neighbours.push(grid[i+1][j]);
    }
    if(i>0)
    {
    this.neighbours.push(grid[i-1][j]);
    }
    if(j<rows-1)
    {
    this.neighbours.push(grid[i][j+1]);
    }
    if(j>0)
    {
    this.neighbours.push(grid[i][j-1]);
    }
    //to include diagonals -->
    /*
    if(i>0 && j>0)
    {
      this.neighbours.push(grid[i-1][j-1]);
    }
    if(i<cols-1 && j>0)
    {
      this.neighbours.push(grid[i+1][j-1]);
    }
    if(i>0 && j<rows-1)
    {
      this.neighbours.push(grid[i-1][j+1]);
    }
    if(i<cols-1 && j<rows-1)
    {
      this.neighbours.push(grid[i+1][j+1]);
    }
*/

  }

  this.show = function(col){ //this takes colour as a parameter
    fill(col);
      if(this.wall)//override colour with black if cell is a wall
      {
        fill(0);
      }
    stroke(0)
    rect(this.i * w,this.j * h,w,h);
  }

}

function setup() {
  // put setup code here
  createCanvas(600,600);
  console.log('A*');

  w = width/cols;
  h = height/rows;
  //2d array here
  for(var i=0;i<rows;i++)
  {
    grid[i] = new Array(rows);
  }

//initialise spots
  for(var i=0;i<rows;i++)
  {
    for(var j=0;j<cols;j++)
    {
      grid[i][j] = new Spot(i,j);
    }
  }
// add neighbours
  for(var i=0;i<rows;i++)
  {
    for(var j=0;j<cols;j++)
    {
      grid[i][j].addNeighbours(grid);
    }
  }

  start = grid[0][0];
  end = grid[rows-1][cols-1];
  start.wall=false;
  end.wall=false;

  openSet.push(start); //this is the very first node. this is where you start the algo, so push it onto openSet first


console.log(grid);
}

function draw() {
  // put drawing code here
  // btw this function loops to draw stuff by default

  if(openSet.length > 0)
  {
    //keep looping
    var winner = 0; //the spot with the lowest f. assume it is at the 0th index initially. THIS STORES THE INDEX NOT THE VALUE
    for(var  i=0;i < openSet.length;i++)
    {
      if(openSet[i].f < openSet[winner].f) //compare cost functions here, select the min
      {
        winner = i;
      }
    }
    var current = openSet[winner];

    if(current === end) //check if you have reached the destinantion
    {
      //find path

      noLoop();
      console.log("DONE!");
    }

    removeFromArray(openSet,current);//remove current from openSet
    closedSet.push(current); //push current spot into closedSet

    var neighbours = current.neighbours;
    for(var i =0; i< neighbours.length; i++)
    {
      var neighbour = neighbours[i];
      if(!closedSet.includes(neighbour) && !neighbour.wall) //check if neighbour is present in closedSet, and check if it is a wall
      {
      var tempG = current.g+1; //store temporary new dist
      var newPath = false;
        if(openSet.includes(neighbour))
          {
            if(tempG<neighbour.g)
            {
              neighbour.g=tempG; //if it's already a part of the openSet, compare g values and pick the min one
              newPath=true; //better update for the prvious spot
            }
          }
          else
          {
            neighbour.g=tempG;// if not present, we update it
            newPath=true;
            openSet.push(neighbour);
          }
          if(newPath)
          {
          neighbour.h = heuristic(neighbour,end);// See heuristic function above
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.previous = current;
        }

      }

    }

  }
  else
  {
  console.log("No solution");
  noLoop();
  return;

  //no solution

  }


 //background(51);
//print grid
 for(var i=0;i<rows;i++)
 {
   for(var j=0;j<cols;j++)
   {
     grid[i][j].show(color(255)); //white by default, hence 255

   }
 }

 //openSet stuff, green cells
 for(var i=0;i<openSet.length;i++)
 {
   openSet[i].show(color(0,255,0));
 }
 //closedSet stuff, red cells
 for(var i=0;i<closedSet.length;i++)
 {
   closedSet[i].show(color(255,0,0));
 }

//find path

 path = [];
 var temp = current;
 //path.push(temp); //push it into the array
 while(temp.previous) //as long as temp has a previous, think Hansel and Gretel, we retrace our steps
 {
   path.push(temp);
   temp=temp.previous;
 }

//trace final path, blue cells
 for(var i=0;i<path.length;i++)
 {
   path[i].show(color(0,0,255));
 }

}
