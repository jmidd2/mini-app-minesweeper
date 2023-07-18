# Mini-App Challenge: Minesweeper
## Basic Requirements

Create a full-stack implementation of Minesweeper . The basic requirements are:

* Use React for all the components
* Write jest tests to verify your gameplay logic and presentation logic. Achieve 80% test coverage.
* Style your game using any CSS and/or styling frameworks ie: MaterialUI, BootStrap....)

Reminder: emphasis should be placed on creating well-defined interfaces, writing code with a clear separation of concerns, and using the principles of modularity, encapsulation, abstraction.

Starting a game:

* Default board size is 10x10
* Place 10 hidden mines randomly on the board

## Gameplay Rules

On each turn, the user clicks on a square to uncover it. If the square:

* Contains a mine, the user loses, and the game is over!
* Is adjacent to a mine, the square displays the total number of mines in the 8 squares around it.
* Is not adjacent to a mine, the square is blank and should behave as if the 8 adjacent squares were also clicked. For each of those squares, their neighboring squares continue to be revealed in each direction (i.e., this step is applied recursively to all neighboring squares) until the edge of the board is reached or until a square is reached that is adjacent to a mine, in which case the previous rule applies.

The last rule winds up uncovering large areas of the board in one turn. This helps speed up gameplay. The user wins when they uncover all squares that don’t have mines.

## Setup:

* Create an empty git repository with a client and server directory.
* Link this repository to a new repository on GitHub as your remote.

## Submitting the project:

* Submit a link to your repository below.

## Level 1

1. [ ] Establish a react front-end minesweeper game board with in-memory game data.
2. [ ] Establish basic game logic that enforces the above game rules on a 10x10 board.
   1. [ ] Each cell is an object that stores pertinent information for that cell (ie. wasClicked, isBomb, adjacentBombCount...)
   2. [ ] One way to store these values to keep track of position is an [adjacency matrix](https://en.wikipedia.org/wiki/Adjacency_matrix#:~:text=In%20graph%20theory%20and%20computer,with%20zeros%20on%20its%20diagonal).
   3. [ ] One could also have a property pointing to adjacent cells directly on the cell object.
   4. [ ] If you are stuck on the game logic, be sure to ask for assistance. You should not be struggling for too long on this section.

## Level 2

1. [ ] Add the ability to change the difficulty (size of the board and quantity of mines).
2. [ ] Add a timer to the game.
3. [ ] View a list of recently played user times and difficulty setting.

## Level 3

1. [ ] Define a RESTful API that connects to a postgres database.
2. [ ] Create a login page that takes in a username (no authentication required).
3. [ ] Database should store each user, their top time, and the game's difficulty setting.
4. [ ] Refactor the frontend to persist and retrieve data to the API.

## Level 4

1. [ ] Establish the ability to undo and redo moves
2. [ ] Establish game logic that increases the duration of the game by 10 seconds for each time the undo/redo feature is used.
3. [ ] Create a user page that shows all times and difficulties for a given user.

## Level 5

1. [ ] Establish the ability to close the browser and reload the previously played game.
2. [ ] Establish the ability to click on a previously completed game and click through the moves that were made.
3. [ ] Deploy with Docker containers.

