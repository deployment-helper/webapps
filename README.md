
# AI-Powered Video Creation Application

This application is designed to create videos using AI technologies. Users provide content and preferences, and the system automates the video creation workflow:

1. **User Input:** Users provide content and preferences for the video.
2. **Scene Generation:** AI analyzes the input to create and select relevant scenes.
3. **Image & Audio Creation:** The backend generates images and audio for each scene using AI models.
4. **Video Assembly:** Scenes are stitched together using ffmpeg to produce a complete video.

## AI Features

- **Scene Creation & Selection:** Automatically generates and selects scenes from user-provided content.
- **Text-to-Audio Generation:** Converts text to audio using AI-powered voice synthesis.

This workflow streamlines video production, making it fast and accessible for users to create high-quality videos with minimal effort.

---

This is a web application built using Next.js and React. It allows users to create, edit, and manage scenes for a video.


## Dev

This is a Next.js based application. Local development can be set up as per the framework documentation.

**CSS and Components**

- Component library: Fluent UI React
  - https://react.fluentui.dev/?path=/docs/theme-colors--page
  - https://react.fluentui.dev/?path=/docs/concepts-developer-theming--page
  - https://react.fluentui.dev/?path=/docs/theme-typography--page

**Development**


**Production Deployment batchserver**

To deploy the application to the batchserver, run the following command:

`npm run build:bs`

`PORT=<port> npm run start:bs:prod`

**Production Deployment image generation server**

To deploy the application to the image generation server, run the following command:

`npm run build:img`

`PORT=<port> npm run start:img:prod`


