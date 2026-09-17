# BAL Coding Tracker

A lightweight VS Code extension by **BlackAlphaLabs** for tracking active coding time, coding sessions, projects, and programming languages.

> **Version:** 1.0.0-beta.1  
> **Release:** Beta

## ✨ Features

- ⏱️ Track active coding time
- 📊 Track individual coding sessions
- 📁 Detect the current project automatically
- 💻 Detect the programming language being edited
- 📝 Store coding activity locally as JSON
- 🕐 Display current coding time directly in the VS Code status bar
- 💤 Automatically stop a session after a period of inactivity
- 🔒 No backend or external service required
- 🌐 Works completely locally

## 📌 How It Works

BAL Coding Tracker monitors your activity inside VS Code and creates coding sessions based on your active development environment.

A session records information such as:

- Project name
- Workspace path
- Programming language
- Session start time
- Session end time
- Session duration

Example:

```json
{
  "id": "44802163-475a-43f4-becb-1a33978afcba",
  "project": "my-project",
  "workspacePath": "I:\\projects\\my-project",
  "language": "typescript",
  "startedAt": "2026-09-17T05:23:39.503Z",
  "endedAt": "2026-09-17T05:24:44.609Z",
  "durationSeconds": 65
}

```

## 💾 Data Storage

- Coding activity is stored locally as a JSON file.

- The extension does not require:

- - A backend server
- - A database
- - An account
- - An API key
- - Cloud synchronization

- Your coding data remains on your local machine.



### The stored data contains:

```text

Total coding time
    ↓
Coding sessions
    ├── Project
    ├── Workspace
    ├── Language
    ├── Start time
    ├── End time
    └── Duration

```


# 🔒 Privacy

- BAL Coding Tracker is designed with local-first data storage.

- The extension does not require sending your coding activity to a remote server.

- Your project information and coding-session data are stored locally on your machine.

## 🖥️ Status Bar

- The extension displays your current coding session directly in the VS Code status bar.

Example:

```text

$(clock) Coding: 00:12:35

```

- Clicking the coding-time indicator can display your accumulated coding time.

## 🚀 Installation

- Install BAL Coding Tracker from the Visual Studio Code Marketplace.

- After installation:

- - Open VS Code.
- - Open a project or workspace.
- - Start working on your code.
- - BAL Coding Tracker will automatically start tracking your coding session.
- - View the current coding time from the VS Code status bar.

## 🧪 Beta Release

- This is the first beta release of BAL Coding Tracker.

- The current release focuses on the core local coding-time tracking system.

- Current

- - Active coding session tracking
- - Project detection
- - Language detection
- - Local JSON storage
- - Status bar tracking
- - Session history
- - Idle session handling


- Planned

- Future versions may introduce:

- - Daily coding statistics
- - Weekly and monthly statistics
- - Project-based statistics
- - Language-based statistics
- - Coding-time dashboards
- - More advanced activity detection
- - Optional backend synchronization
- - Online coding profiles
- - Coding-time rankings
- - Cross-device synchronization


🎯 Project Vision

- BAL Coding Tracker is being developed as a local-first coding productivity tracker that can eventually provide developers with a detailed view of how they spend their development time.

- The initial architecture focuses on keeping the VS Code extension independent and functional without requiring a backend.

- Future versions may optionally connect the extension to a backend service for synchronization, dashboards, and developer statistics.

## 🤝 Contributing

- Contributions, suggestions, bug reports, and feature requests are welcome.

- If you find a problem or have an idea for improving BAL Coding Tracker, please open an issue or submit a pull request in the project repository.

## 📄 License

- This project is maintained by BlackAlphaLabs.

- See the repository license for the applicable terms.


Developed by (BlackAlphaLabs)[https://www.blackalphalabs.com/].