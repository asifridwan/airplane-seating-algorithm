import PromptSync from "prompt-sync"

const prompt = PromptSync()

// Get seating layout input and format it
let inputArray = prompt('Enter the seating layout as a 2D array : ')
inputArray = eval(inputArray)

// Checks if the input is a valid 2D array
if(typeof(inputArray) === 'object' && inputArray[0][0]) {
    // Checks if there are two or more columns
    if(inputArray.length < 2) {
        console.log('There should be at least two columns !')
    }
    else {
        // Checks if there are at least two seats in the first and last column
        if(inputArray[0][0] < 2 && inputArray[inputArray.length - 1][0] < 2) {
            console.log('There should be at least two seats in the first and last column')
        }
        else {
            // Checks to see if there are any non-numbers in the 2D array
            for(let i = 0; i < inputArray.length; i++) {
                if(typeof(inputArray[i][0]) !== 'number' || typeof(inputArray[i][0]) !== 'number') {
                    console.log('The 2D array should only contain numbers !')
                    process.exit(0)
                }
            }
            
            // Get number of passengers and format it
            let inputPassengers = prompt('Enter the number of passengers : ')
            inputPassengers = eval(inputPassengers)
            
            // Checks if there are too many passengers than the number of seats
            if(typeof(inputPassengers) === 'number') {
                let numberOfSeats = 0
        
                // Calculate the total number of seats
                for(let i = 0; i < inputArray.length; i++) {
                    numberOfSeats += (inputArray[i][0] * inputArray[i][1])
                }
        
                // Terminate with error if there are more passengers than seats
                if(numberOfSeats < inputPassengers) {
                    console.log('Not enough seats for passengers !')
                }
                // Create the seating layout and put passengers according to rules
                else {
                    // Creates empty seats
                    const arrangement = new Array(inputArray.length)
                    let maxRow = 0

                    for(let i = 0; i < inputArray.length; i++) {
                        arrangement[i] = Array(inputArray[i][1]).fill().map(() => Array(inputArray[i][0]).fill('_'))
                        maxRow = Math.max(maxRow, inputArray[i][1])
                    }

                    // Seats audiences in flight based on given rules
                    for(let i = 1; i <= inputPassengers; i++) {
                        // Checks if any aisle seat is empty
                        if(checkAisle(arrangement, maxRow)) {
                            let [a, b, c] = checkAisle(arrangement, maxRow)

                            arrangement[a][b][c] = i
                        }
                        // If aisle seats are filled then checks for an empty window seat
                        else if(checkWindow(arrangement, maxRow)) {
                            let [a, b, c] = checkWindow(arrangement, maxRow)

                            arrangement[a][b][c] = i
                        }
                        // If both aisle and window seats are filled then checks for an empty middle seat
                        else {
                            let [a, b, c] = checkMiddle(arrangement, maxRow)

                            arrangement[a][b][c] = i
                        }
                    }

                    // Show the seating layout
                    showLayout(arrangement, maxRow)
                }
            }
            // Teminate with error if the number of passengers is an invalid type
            else {
                console.log('Wrong input type !')
            }
        }
    }
}
// Terminate with error if input is not a valid 2D array
else {
    console.log('Wrong input type or Not a valid 2D array !')
}

// Checks for any empty aisle seat
function checkAisle(arrangement, maxRow) {
    for(let i = 0; i < maxRow; i++) {
        for(let j = 0; j < arrangement.length; j++) {
            let rowSeat = arrangement[j][i]

            if(rowSeat) {
                let lastPos = rowSeat.length - 1

                if(j === 0) {
                    if(rowSeat[lastPos] === '_') return [j, i, lastPos]
                }
                else if(j === arrangement.length - 1) {
                    if(rowSeat[0] === '_') return [j, i, 0]
                }
                else {
                    if(rowSeat[0] === '_') return [j, i, 0]

                    if(rowSeat[lastPos] === '_') return [j, i, lastPos]
                }
            }
        }
    }
}

// Checks for any empty window seat
function checkWindow(arrangement, maxRow) {
    for(let i = 0; i < maxRow; i++) {
        for(let j = 0; j < arrangement.length; j++) {
            let rowSeat = arrangement[j][i]

            if(rowSeat) {
                let lastPos = rowSeat.length - 1

                if(j === 0) {
                    if(rowSeat[0] === '_') return [j, i, 0]
                }

                if(j === arrangement.length - 1) {
                    if(rowSeat[lastPos] === '_') return [j, i, lastPos]
                }
            }
        }
    }
}

// Checks for any empty middle seat
function checkMiddle(arrangement, maxRow) {
    for(let i = 0; i < maxRow; i++) {
        for(let j = 0; j < arrangement.length; j++) {
            let rowSeat = arrangement[j][i]

            if(rowSeat && rowSeat.length > 2) {
                for(let k = 1; k < rowSeat.length - 1; k++) {
                    if(rowSeat[k] === '_') return [j, i, k]
                }
            }
        }
    }
}

// Displays the passenger seating layout
function showLayout(arrangement, maxRow) {
    for(let i = 0; i < maxRow; i++) {
        let str = ''
        for(let j = 0; j < arrangement.length; j++) {
            let rowSeat = arrangement[j][i]
            let rowSeatLength = arrangement[j][0].length

            if(rowSeat) {
                str = str + '[' + rowSeat.toString() + ']'
            }
            else {
                const emptySpace = new Array(rowSeatLength).fill(' ')

                str = str + ' ' + emptySpace.join('  ') + ' '
            }

            str = str + ' '
        }

        console.log(str)
    }
}