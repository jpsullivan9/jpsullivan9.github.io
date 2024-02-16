# Instructions for Classmate Collaborators

## Pulling the Project (with GitHub Desktop)
1. **Open GitHub Desktop** and sign in with your GitHub account.
2. Go to **File > Clone Repository.**
3. In the URL tab, paste **'https://github.com/jpsullivan9/jpsullivan9.github.io.git'** into the repository URL field.
4. Choose where you want to save the repository on your local machine and click **Clone.**

## Installing Dependencies
1. Open your IDE environment (Visual Studio Code) to the location of the project.
2. Open your terminal (On VS Code this option is located in the terminal tab at the top).
3. Run the following command to install all neccessary dependencies:
```bash
npm install
```

## Test the Project Locally
1. After you make some changes and want to test them before pushing run the following in terminal:
```bash
npm test
```
2. This command creates a simulated web server on your device. Open the link provided in the terminal to view the project.
**Note:** The Vercel server online updates with git push commands, and your localized Vercel server updates with any file edits. Simply refresh the page in your browser to see changes.

## Committing Your Changes
1. **Make Your Changes:** Edit files, add new content, and make your modifications within the project directory.
2. **Open GitHub Desktop:** Your changes should appear in the "Changes" tab.
3. **Select Files to Commit:** Check the boxes next to each file you wish to commit. If you want to commit all changes, click on the checkbox in the header to select all.
4. **Write a Commit Message:** In the bottom left, fill in the summary (required) and description (optional) for your commit. Be descriptive, so we all know what changes you've made.
5. **Commit to Main:** Click the "Commit to main" button to finalize your changes.

## Push Your Changes
1. After committing your changes in GitHub Desktop, click the **Push origin** button in the upper right to update the remote server and our GitHub repo.

## Pulling Latest Changes
To ensure you're working with the latest version of the project:

1. Open GitHub Desktop.
2. Click on **Repository** in the menu bar.
3. Select **Pull** from the dropdown to fetch the latest changes from the remote repository.





## Pulling the Project (with Git)

To pull the project to your local machine, navigate to the desired directory in your terminal and run:

```bash
git pull https://github.com/jpsullivan9/jpsullivan9.github.io.git
```

##Installing Dependencies
To install all necessary dependencies to run this project locally on your device, execute:
```bash
npm install
```

##Running the Project Locally
To create a simulated web server on your device and open it at the link provided in the terminal, use:
```bash
npm test 
```

**Note**: The Vercel server online updates with git push commands, and your localized Vercel server updates with any file edits. Just refresh the page in your browser to see changes.

##Committing Your Changes

When you believe your changes function well and want to commit them to the web server:

1. Add Files to Commit
To add a specific file:
```bash
git add <filename> 
```

Or, to add all files in your working directory:

```bash
git add .
```

2. Commit Your Changes
Commit your changes with a message describing what you've done:
```bash
git commit -m "Your commit message here"
```
Please use thorough messages so we can debug in case of errors later on.

3. Push Your Changes
Finally, to update the remote server and our GitHub repo, run:
```bash
git push
```
***
If you have any questions about this process please let me know. 
James