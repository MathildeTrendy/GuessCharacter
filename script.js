// Function to load the tree from a JSON file
function loadTreeFromFile() {
    return new Promise((resolve, reject) => {
        fetch('tree.json') // Adjust the path to your JSON file
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network error: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

// Function to set parent nodes recursively
function setParentNodes(node, parent = null) {
    if (node) {
        node.parent = parent; // Set parent reference for the current node

        // Recursively set parent nodes for yes and no branches
        setParentNodes(node.yes, node);
        setParentNodes(node.no, node);
    }
}

// Function to run the main game logic
function runGame() {
    // Load the tree from the JSON file
    loadTreeFromFile()
        .then(tree => {
            // Set parent nodes for all nodes in the tree
            setParentNodes(tree);

            // Log the tree to console to verify parent nodes are correctly set
            console.log(tree);

            // Initialize currentNode to the root node of the tree
            currentNode = tree;

            // Display the first question
            displayQuestion(currentNode);
        })
        .catch(error => {
            console.error('Error loading the tree:', error);
        });
}

// Sample code to update question and options
const questionElement = document.getElementById('question');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

let currentNode; // Hold the current node in the tree

// Sample initialization
runGame(); // Start the game

function updateCurrentNode(response) {
    // Update the current node based on the user's response
    currentNode = response === 'yes' ? currentNode.yes : currentNode.no;
}

function displayQuestion(node) {
    // Ensure the node is defined before accessing its properties
    if (node) {
        // Update the question with the current node's question
        questionElement.textContent = node.question;
    }
}

function handleResponse(response) {
    // Update the current node based on the user's response
    updateCurrentNode(response);
    // Display the next question
    displayQuestion(currentNode);
}

// Event listeners for Yes and No buttons
yesBtn.addEventListener('click', () => {
    // Handle the user's response Yes
    console.log('User clicked Yes');
    handleResponse('yes');
});

noBtn.addEventListener('click', () => {
    // Handle the user's response No
    console.log('User clicked No');
    handleResponse('no');
});
