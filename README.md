# Instructions for Classmate Collaborators

## Pulling the Project

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