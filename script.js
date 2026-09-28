const API_URL =
    "https://script.google.com/macros/s/AKfycbweJftIXXsvEAum4ip2V7qEx6tO7uoJuiwBC2VN6yYs6l01I-OXDmOmGnq2tQyXd1Hb/exec";


// =====================================================
// GET HTML ELEMENTS
// =====================================================

const studentNameInput =
    document.getElementById("student-name");

const monitorSelect =
    document.getElementById("monitor");

const voteButton =
    document.getElementById("vote-btn");

const message =
    document.getElementById("message");

const voteList =
    document.getElementById("vote-list");


// =====================================================
// LOAD VOTES
// =====================================================

async function loadVotes() {

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        if (!data.success) {

            message.textContent =
                "Unable to load votes: " + data.message;

            return;
        }

        displayVotes(data.votes);

    }

    catch (error) {

        console.error("Load votes error:", error);

        message.textContent =
            "Unable to connect to voting server.";

    }
}


// =====================================================
// DISPLAY VOTES
// =====================================================

function displayVotes(votes) {

    let SureshVotes = 0;
    let DeepankVotes = 0;
    let AbhikVotes = 0;


    // Count votes

    votes.forEach(function(vote) {

        if (vote.monitor === "Suresh") {

            SureshVotes++;

        }

        else if (vote.monitor === "Deepank") {

            DeepankVotes++;

        }

        else if (vote.monitor === "Abhik") {

            AbhikVotes++;

        }

    });


    // Update total counts

    document.getElementById("total-count").textContent =
        votes.length;

    document.getElementById("Suresh-count").textContent =
        SureshVotes;

    document.getElementById("Deepank-count").textContent =
        DeepankVotes;

    document.getElementById("Abhik-count").textContent =
        AbhikVotes;


    // Clear previous vote list

    voteList.innerHTML = "";


    // Display individual votes

    votes.forEach(function(vote) {

        const voteItem =
            document.createElement("div");

        voteItem.className = "vote-item";


        const voteText =
            document.createElement("span");

        voteText.textContent =
            vote.student +
            " voted for " +
            vote.monitor;


        // Delete button

        const deleteButton =
            document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.type = "button";

        deleteButton.className = "delete-btn";


        // Delete vote

        deleteButton.addEventListener(
            "click",
            async function() {

                const confirmDelete =
                    confirm(
                        "Are you sure you want to delete this vote?"
                    );


                if (!confirmDelete) {

                    return;

                }


                deleteButton.disabled = true;

                deleteButton.textContent =
                    "Deleting...";


                try {

                    const response =
                        await fetch(
                            API_URL,
                            {
                                method: "POST",

                                body: JSON.stringify({
                                    action: "delete",
                                    row: vote.row
                                })
                            }
                        );


                    const result =
                        await response.json();


                    if (result.success) {

                        message.textContent =
                            "Vote deleted successfully.";

                        await loadVotes();

                    }

                    else {

                        message.textContent =
                            result.message;

                        deleteButton.disabled = false;

                        deleteButton.textContent =
                            "Delete";

                    }

                }

                catch (error) {

                    console.error(
                        "Delete error:",
                        error
                    );

                    message.textContent =
                        "Unable to delete vote.";

                    deleteButton.disabled = false;

                    deleteButton.textContent =
                        "Delete";

                }

            }
        );


        voteItem.appendChild(voteText);

        voteItem.appendChild(deleteButton);

        voteList.appendChild(voteItem);

    });

}


// =====================================================
// SUBMIT VOTE
// =====================================================

voteButton.addEventListener(
    "click",
    async function() {

        const studentName =
            studentNameInput.value.trim();

        const selectedMonitor =
            monitorSelect.value;


        // Validate student name

        if (studentName === "") {

            message.textContent =
                "Please enter student name.";

            studentNameInput.focus();

            return;

        }


        // Disable button

        voteButton.disabled = true;

        voteButton.textContent =
            "Voting...";


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        body: JSON.stringify({
                            student: studentName,
                            monitor: selectedMonitor
                        })
                    }
                );


            const result =
                await response.json();


            if (result.success) {

                message.textContent =
                    "Vote submitted successfully!";

                studentNameInput.value = "";

                await loadVotes();

            }

            else {

                message.textContent =
                    result.message;

            }

        }

        catch (error) {

            console.error(
                "Vote submission error:",
                error
            );

            message.textContent =
                "Unable to submit vote.";

        }


        // Enable button again

        voteButton.disabled = false;

        voteButton.textContent =
            "Vote";

    }
);


// =====================================================
// LOAD VOTES WHEN PAGE OPENS
// =====================================================

loadVotes();


// =====================================================
// REFRESH EVERY 5 SECONDS
// =====================================================

setInterval(
    loadVotes,
    5000
);