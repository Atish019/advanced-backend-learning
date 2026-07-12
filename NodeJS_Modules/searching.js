function linearSearch(arr, val) {
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] === val){
            return -1;
        }
    }
}

function binarySearch(arr, val) {
    let left = 0;
    let right = arr.length - 1;
    let middle = Math.floor((left + right) / 2);

    while(arr[middle] !== val && left <= right) {
        if(val < arr[middle]) {
            right = middle - 1;
        }
        else {
            left = middle + 1;
        }
        middle = Math.floor((left + right) / 2);
    }

    return arr[middle] === val ? middle : -1;
}

function binarySearchOnAns() {
    // some implementation
}

// // In commonJS moduling exporting in done by 'module' global variable
// module.exports = {
//     linearSearch,
//     binarySearchOnAns
// }

exports.binarySearch = binarySearch
exports.linearSearchSearch = linearSearch