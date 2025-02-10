# Word_Puzzle_Solver
The Word Puzzle Solver is a C++-based project designed to efficiently search and extract words from a given grid of letters using Trie, Hash Maps, and Backtracking. Developed as part of my Data Structures & Algorithms (DSA) course at PIEAS, this project showcases practical applications of algorithmic techniques and data structures in solving real-world problems.

🚀 Features
1. Efficient Word Search – Finds words from the grid in multiple directions (horizontal, vertical, diagonal).
2. Optimized Performance – Utilizes Trie for quick word lookup, Hash Maps for fast retrieval, and Backtracking for systematic search.
3. Interactive Input Handling – Allows users to input custom grids and dictionaries.
4. Command-Line Interface – Displays results in a structured format, highlighting found words.

🔧 Technologies Used
C++ – Implements Object-Oriented Programming (OOP) and DSA concepts.
Trie Data Structure – Enables fast and efficient word searching.
Hash Maps – Stores words for optimized lookup.
Backtracking Algorithm – Explores all possible word paths systematically.
📌 About the Project
The Word Puzzle Solver takes a grid of letters and a dictionary of valid words as input. It then systematically searches for all possible words that can be formed by moving in eight possible directions. By leveraging advanced data structures, the solver efficiently processes large grids and extensive word lists, ensuring high performance and accuracy.

📂 How to Use
Clone the repository

git clone https://github.com/DarainHyder/WordPuzzleSolver.git
cd WordPuzzleSolver
Compile the C++ source code

g++ -o solver main.cpp -std=c++11
Run the solver
./solver
Provide the puzzle grid and dictionary as input.
View the results in the console, displaying all found words.
📌 Example
Input Grid:

C A T  
R A T  
D O G  
Dictionary: { "CAT", "RAT", "DOG", "CARD" }

Output:

Words found: CAT, RAT, DOG, CARD  
💡 Future Improvements
Implementing a graphical user interface (GUI) for better visualization.
Enhancing memory efficiency for handling larger dictionaries.
Introducing multi-threading for faster word searches in large grids.
This project is a great demonstration of DSA concepts applied to a fun and practical problem! 🚀
