# Module 6 - Game Posts Viewer

## About the App

For this assignment, I made this app to simulate the idea that I am going for. The idea is an app where you can post your reviews on video games and let others know what you think about them and whether they should try them out. This app retrieves posts from an external API and displays them in a scrollable list. I chose this color scheme to make the app more fun and give it a better vibe.

## API Used

- **API:** JSONPlaceholder
- **Endpoint:** https://jsonplaceholder.typicode.com/posts
- **Method:** GET
- **Data:** Post ID, User ID, Title, and Body
- **API Key:** None required

## Features

- Retrieves online data using `fetch()` and `async/await`.
- Displays posts with four different fields.
- Includes loading, error, and empty states.
- Has Refresh Posts, Test Error, Test Empty State, and Retry buttons.

## How to Run

1. Open the project in VS Code.
2. Run `npm install` in the terminal.
3. Run `npx expo start`.
4. Press `a` to launch the Android emulator.

## Testing

I made sure that I had all the requirements needed for this assignment. I included a button to reload the data, a button to test errors, a Retry button, and a button to show what the app looks like when there is no data available.

## Design

I made a separate prototype so I could have the whole package. My other project is an app that focuses on a personal collection of video games. This app would allow you to see what others think about different games. You could then try out a new game and add it to your personal collection in the other app.