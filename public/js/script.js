document.addEventListener("DOMContentLoaded", () => {
    // Get the elements
    const popupOverlay = document.getElementById('popupOverlay');
    const popupBackground = document.getElementById('popupBackground');
    const closePopupButton = document.getElementById('close-popup-button');
    const finalScore = document.getElementById('finalScore');
    const timerElement = document.getElementById("timer");
    const scoreboardElement = document.getElementById("scoreboard");
    const gameBlock = document.getElementById("gameBlock");
    const gameResultTitle = document.getElementById("gameResultTitle");
    const resetButton = document.getElementById("reset-button");

    // Game variables
    let flippedCards = [];
    let matchedPairs = 0;
    let score = 0;
    let timer = 300;
    let gameOver = false;

    // Function to show the popup
    const showPopup = (won) => {
        gameResultTitle.innerText = won ? "Congratulations! You Won!" : "Game Over!";
        finalScore.innerText = score;
        popupOverlay.classList.add("visible");
        popupBackground.classList.add("visible");
    };

    // Function to hide the popup
    const hidePopup = () => {
        popupOverlay.classList.remove("visible");
        popupBackground.classList.remove("visible");
    };

    // Event listeners for popup buttons
    closePopupButton.addEventListener('click', hidePopup);
    popupBackground.addEventListener('click', hidePopup);

    // Update score
    const updateScore = () => {
        scoreboardElement.innerText = `Score: ${score}`;
    };

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Reset game function
    const resetGame = () => {
        window.location.reload();
        flippedCards = [];
        matchedPairs = 0;
        score = 0;
        timer = 300; // Reset timer to 5 minutes
        gameOver = false;
        updateScore();
        timerElement.innerText = `Time: ${formatTime(timer)}`;
        hidePopup(); // Hide popup overlay and background

        // Clear all cards and remove "matched" class
        document.querySelectorAll(".card").forEach((card) => {
            card.innerHTML = getCardSVG();
            card.classList.remove('matched');
        });
    };

    // Reset game button event listener
    resetButton.addEventListener("click", resetGame);

    // Fetch the shapes data from the server
    fetch("/api/shapes")
        .then((response) => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then((shapes) => {
            if (Array.isArray(shapes)) {
                // Duplicate and shuffle shapes
                const shuffledShapes = [...shapes, ...shapes].sort(() => Math.random() - 0.5);

                // Create a card element
                const createCard = (index) => {
                    const card = document.createElement("div");
                    card.classList.add("card");
                    card.dataset.index = index;
                    card.innerHTML = getCardSVG(); // Use your SVG code here
                    card.addEventListener("click", () => chooseCard(card, shuffledShapes[index]));
                    return card;
                };

                // Get SVG for card face (placeholder, replace with your actual SVG)
                const getCardSVG = () => `<!-- Your SVG code here -->`;

                // Create cards
                shuffledShapes.forEach((shape, index) => {
                    const card = createCard(index);
                    gameBlock.appendChild(card);
                });

                let disableClick = false;

                // Handle card choice
                const chooseCard = (card, shape) => {
                    // Prevent clicks if disabled, if the card is already flipped, or if the card is already matched
                    if (disableClick || flippedCards.includes(card) || card.classList.contains('matched')) return;

                    flippedCards.push(card);
                    card.innerHTML = `<i class="${shape.icon}"></i>`; // Show shape icon

                    // Check for a match only if two cards are flipped
                    if (flippedCards.length === 2) {
                        checkMatch(shape);
                    }
                };

                // Check for match
                const checkMatch = (shape) => {
                    disableClick = true; // Disable clicking during the check
                    const firstShape = shuffledShapes[flippedCards[0].dataset.index];

                    // Check if the two flipped cards match
                    if (firstShape.icon === shape.icon) {
                        matchedPairs++;
                        score += 10; // Increase score for a match
                        updateScore(); // Update the score display

                        // Mark both cards as matched (lock them)
                        flippedCards.forEach(card => {
                            card.classList.add('matched'); // Add class to indicate matched (lock the card)
                        });

                        flippedCards = []; // Clear flipped cards as they are a match
                        checkGameWon(); // Check if the game has been won

                        // Re-enable clicking immediately after a match
                        disableClick = false;
                    } else {
                        // Delay to show the mismatched cards before flipping them back
                        setTimeout(() => {
                            flippedCards.forEach((card) => {
                                card.innerHTML = getCardSVG(); // Reset the card to its initial state
                            });
                            flippedCards = []; // Clear the flipped cards array
                            score = Math.max(score - 1, 0); // Decrease score for a mismatch
                            updateScore(); // Update the score display after a mismatch
                            disableClick = false; // Re-enable clicking after delay
                        }, 1000); // Delay of 1 second before resetting the cards
                    }
                };

                // Check if the game is won
                const checkGameWon = () => {
                    if (matchedPairs === shapes.length) {
                        gameOver = true;
                        showPopup(true);
                    }
                };

                // Timer countdown
                const intervalId = setInterval(() => {
                    if (timer > 0 && !gameOver) {
                        timer--;
                        timerElement.innerText = `Time: ${formatTime(timer)}`;
                    } else if (timer === 0) {
                        gameOver = true;
                        showPopup(false);
                        clearInterval(intervalId);
                    }
                }, 1000);
            }
        })
        .catch((error) => {
            console.error("Error fetching shapes:", error);
            alert("Failed to load shapes. Please try again later.");
        });
});
