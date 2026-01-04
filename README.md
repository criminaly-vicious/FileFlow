# FileFlow

   ______ _ _      ______ _           
  |  ____(_) |    |  ____| |          
  | |__   _| | ___| |__  | | ___  ___ 
  |  __| | | |/ _ \  __| | |/ _ \/ __|
  | |    | | |  __/ |    | | (_) \__ \
  |_|    |_|_|\___|_|    |_|\___/|___/
                                     

FileFlow is a modern, efficient file manager designed to provide an intuitive user experience for organizing, searching, and visualizing your files. It aims to integrate seamlessly with cloud storage services and offer a powerful search system.

## How to Contribute

We welcome contributions from everyone! Here's how you can help:

*   **Reporting Bugs:** If you find a bug, please open an issue and provide as much detail as possible.
*   **Suggesting Enhancements:** Have an idea for a new feature or an improvement? Open an issue to discuss it.
*   **Pull Requests:** We are happy to accept pull requests. Please make sure to follow the existing code style and to have a clear description of the changes you are making.

## What has been done

*   **Project Setup:** The basic project structure has been created with Electron, React, and TypeScript.
*   **Frontend UI:** A basic user interface has been implemented with React, including:
    *   File and folder navigation.
    *   Create, Rename, Delete, and Move operations (simulated).
    *   File type icons and a basic file "view" functionality.
    *   A basic search bar.

## What is pending (Features) 

*   **Backend Implementation (Rust):** The Rust backend for handling file system operations needs to be implemented. This is currently blocked due to issues with the `cargo` command in the development environment.
*   **Advanced Search:** The search functionality needs to be expanded to include searching by type, date, and content.
*   **Cloud Storage Integration:** Integration with services like Google Drive and Dropbox is planned.
*   **Testing:** Comprehensive testing of all functionalities.
*   **Polishing:** UI/UX improvements and bug fixes.
