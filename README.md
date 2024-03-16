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
2. The first time you run this you will be asked to link your [Github](https://github.com) account to `Vercel`.  This is to be done only for the first time.  If you have already performed this step, proceed to next.  Otherwise, follow the sub-points.
    * You will now be asked to choose a login method because no credential is found.
        ```shell
        > anzom@1.0.0 test
        > vercel dev

        (node:93517) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
        (Use `node --trace-deprecation ...` to show where the warning was created)
        Vercel CLI 33.6.1
        > > No existing credentials found. Please log in:
        ? Log in to Vercel
        ● Continue with GitHub
        ○ Continue with GitLab
        ○ Continue with Bitbucket
        ○ Continue with Email
        ○ Continue with SAML Single Sign-On
        ─────────────────────────────────
        ○ Cancel
        ```
    * It selects `Continue with GitHub` by default.  If you want to use a different login mechanism such as, `GitLab` or `Email`, use the :arrow_up: or :arrow_down: key on your keyboard to select one.  Once done, HIT ENTER.
    * You will be asked to login as appropriate.  For `GitHub`, you will be taken to the website where you will login to your account.
    * After you login, you will be displayed with the below message and the asked a few questions.  Hit ENTER to select the default selection, i.e. `Y`.
        ```shell
        > Please visit the following URL in your web browser:
        > Success! GitHub authentication complete for <your_email>
        ? Set up and deploy “~/Documents/Projects/personal/jpsullivan9.github.io”? [Y/n] y
        ? Which scope do you want to deploy to? <your_name> projects
        ? Found project “<your_name>/jpsullivan9-github-io”. Link to it? [Y/n
        ] y
        🔗  Linked to <your_name>/jpsullivan9-github-io (created .vercel)
        🔍  Inspect: https://vercel.com/<your_name>/jpsullivan9-github-io/ChGStJeWioTklsdLASDsuCTVR2WE [3s]
        ✅  Preview: https://jpsullivan9-github-6mh6jvfkn.vercel.app [3s]
        📝  To deploy to production (jpsullivan9-github-io.vercel.app), run `vercel --prod`
        ```
3. This command creates a simulated web server on your device. Open the link provided in the terminal to view the project.
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

***



## Pulling the Project (with Git)

To pull the project to your local machine, navigate to the desired directory in your terminal and run:

```bash
git pull https://github.com/jpsullivan9/jpsullivan9.github.io.git
```

## Installing Dependencies
To install all necessary dependencies to run this project locally on your device, execute:
```bash
npm install
```

## Running the Project Locally
To create a simulated web server on your device and open it at the link provided in the terminal, use:
```bash
npm test 
```

**Note**: The Vercel server online updates with git push commands, and your localized Vercel server updates with any file edits. Just refresh the page in your browser to see changes.

## Committing Your Changes

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