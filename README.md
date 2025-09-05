# Cydeo Attendance Bot

This is a simple desktop application to help automate marking attendance for Cydeo classes.

## Prerequisites

Before you begin, ensure you have [Node.js](https://nodejs.org/) installed on your computer.

## Setup Instructions

1.  **Clone the repository:**
    Open your terminal or command prompt and run the following command to download the project:
    ```bash
    git clone https://github.com/irfanalkan23/cydeo-attendance-bot.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd cydeo-attendance-bot
    ```

3.  **Install dependencies:**
    Run this command to download the required libraries (Electron and Playwright).
    ```bash
    npm install
    ```

4.  **Save your login session:**
    This step is crucial. Run the following command. It will open a browser window. Log in to your Cydeo account manually. Once you have successfully logged in, the script will save your session to a local `auth.json` file and the browser will close automatically.
    ```bash
    node save-auth.js
    ```

## How to Use

1.  **Start the application:**
    Run the following command in the project directory:
    ```bash
    npm start
    ```

2.  **Mark Attendance:**
    *   The application window will open and display a list of students in your class.
    *   Select the checkboxes next to the students you want to mark.
    *   Click the "Submit" button.
    *   The bot will then automate the process of setting the attendance status to "4" for all attendance columns for the selected students (if they aren't already set to "2" or "4").
    *   You can see the progress in the terminal window.
