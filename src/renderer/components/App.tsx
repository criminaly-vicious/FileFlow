import React, { useState } from "react";
import path from 'path-browserify'; // For path manipulation in the browser environment

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  content?: string; // For simulated file content
}

const initialFiles: FileItem[] = [
  { id: "1", name: "Documents", type: "folder", path: "/Documents" },
  { id: "2", name: "Images", type: "folder", path: "/Images" },
  { id: "3", name: "report.pdf", type: "file", path: "/Documents/report.pdf", content: "This is a simulated PDF report." },
  { id: "4", name: "photo.jpg", type: "file", path: "/Images/photo.jpg", content: "This is a simulated image file." },
  { id: "5", name: "readme.txt", type: "file", path: "/readme.txt", content: "Hello, this is a readme file." },
  { id: "6", name: "Vacation", type: "folder", path: "/Documents/Vacation" },
  { id: "7", name: "notes.txt", type: "file", path: "/Documents/Vacation/notes.txt", content: "Vacation notes." },
];

// Function to get appropriate icon based on file type
const getFileIcon = (file: FileItem) => {
  if (file.type === "folder") {
    return "📁";
  }
  const ext = path.extname(file.name).toLowerCase();
  switch (ext) {
    case ".pdf":
      return "📄";
    case ".jpg":
    case ".jpeg":
    case ".png":
    case ".gif":
      return "🖼️";
    case ".txt":
      return "📝";
    default:
      return "❓";
  }
};

const App = () => {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFileType, setNewFileType] = useState<"file" | "folder">("file");

  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [renamedFileName, setRenamedFileName] = useState<string>("");

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);

  const [showMoveModal, setShowMoveModal] = useState<boolean>(false);
  const [fileToMove, setFileToMove] = useState<FileItem | null>(null);
  const [destinationPath, setDestinationPath] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");


  const navigateTo = (newPath: string) => {
    setCurrentPath(newPath);
    // In a real app, this would fetch files from the new path
  };

  const createNewItem = () => {
    if (newFileName.trim() === "") {
      alert("Name cannot be empty!");
      return;
    }

    const newPath = path.join(currentPath, newFileName);
    const newItem: FileItem = {
      id: Date.now().toString(), // Simple unique ID
      name: newFileName,
      type: newFileType,
      path: newPath,
      content: newFileType === "file" ? "New file content." : undefined,
    };

    setFiles([...files, newItem]);
    setNewFileName("");
    setShowCreateModal(false);
  };

  const startRename = (file: FileItem) => {
    setSelectedFile(file);
    setRenamedFileName(file.name);
    setShowRenameModal(true);
  };

  const renameItem = () => {
    if (selectedFile && renamedFileName.trim() !== "") {
      const oldPath = selectedFile.path;
      const newPath = path.join(path.dirname(oldPath), renamedFileName);

      setFiles(files.map(file => {
        if (file.id === selectedFile.id) {
          return { ...file, name: renamedFileName, path: newPath };
        }
        // Also update paths of children if a folder is renamed
        if (file.path.startsWith(oldPath + '/') && selectedFile.type === "folder") {
          const relativePath = file.path.substring(oldPath.length);
          return { ...file, path: newPath + relativePath };
        }
        return file;
      }));
      setSelectedFile(null);
      setRenamedFileName("");
      setShowRenameModal(false);
    } else {
      alert("Please select a file and provide a valid name.");
    }
  };

  const startDelete = (file: FileItem) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const deleteItem = () => {
    if (fileToDelete) {
      setFiles(files.filter(file => {
        // If deleting a folder, also remove its children
        if (fileToDelete.type === "folder") {
          return !file.path.startsWith(fileToDelete.path + '/') && file.id !== fileToDelete.id;
        }
        return file.id !== fileToDelete.id;
      }));
      setFileToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const startMove = (file: FileItem) => {
    setFileToMove(file);
    setDestinationPath(currentPath); // Default to current path
    setShowMoveModal(true);
  };

  const moveItem = () => {
    if (fileToMove && destinationPath.trim() !== "") {
      const oldPath = fileToMove.path;
      const newPath = path.join(destinationPath, fileToMove.name);

      setFiles(files.map(file => {
        if (file.id === fileToMove.id) {
          return { ...file, path: newPath };
        }
        // Also update paths of children if a folder is moved
        if (file.path.startsWith(oldPath + '/') && fileToMove.type === "folder") {
          const relativePath = file.path.substring(oldPath.length);
          return { ...file, path: path.join(newPath, relativePath) };
        }
        return file;
      }));
      setFileToMove(null);
      setDestinationPath("");
      setShowMoveModal(false);
    } else {
      alert("Please select a file and provide a valid destination path.");
    }
  };

  const viewFile = (file: FileItem) => {
    if (file.type === "file" && file.content) {
      alert(`Viewing "${file.name}":\n\n${file.content}`);
    } else if (file.type === "folder") {
      alert(`Cannot view content of folder "${file.name}".`);
    } else {
      alert(`No content available for "${file.name}".`);
    }
  };


  const filteredFiles = files.filter(file => {
    const parentPath = path.dirname(file.path);
    // Normalize paths to ensure consistent matching, especially for root
    const normalizedParentPath = parentPath === '.' ? '/' : parentPath;
    const normalizedFilePath = file.path;

    const matchesPath = (currentPath === '/' && (normalizedParentPath === '/' || file.path === currentPath)) ||
                        (currentPath !== '/' && normalizedParentPath === currentPath);
    
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPath && matchesSearch;

  }).sort((a, b) => {
    if (a.type === "folder" && b.type !== "folder") return -1;
    if (a.type !== "folder" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name);
  });


  return (
    <div>
      <h1>FileFlow</h1>
      <h2>Current Path: {currentPath}</h2>
      <button onClick={() => navigateTo("/")}>Home</button>
      {currentPath !== "/" && (
        <button onClick={() => navigateTo(path.dirname(currentPath) === '.' ? '/' : path.dirname(currentPath))}>
          Back
        </button>
      )}

      <div>
        <input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h3>Files and Folders:</h3>
      <ul>
        {filteredFiles.map((file) => (
          <li key={file.id}>
            {getFileIcon(file)} {file.name}
            {file.type === "folder" && (
              <button onClick={() => navigateTo(file.path)}>Open</button>
            )}
            {file.type === "file" && (
              <button onClick={() => viewFile(file)}>View</button>
            )}
            <button onClick={() => startRename(file)}>Rename</button>
            <button onClick={() => startDelete(file)}>Delete</button>
            <button onClick={() => startMove(file)}>Move</button>
          </li>
        ))}
      </ul>

      <hr />
      <h3>File Operations (Frontend Simulation)</h3>
      <button onClick={() => setShowCreateModal(true)}>
        Create New
      </button>
      <button onClick={() => setShowRenameModal(true)}>Rename</button>
      <button onClick={() => setShowMoveModal(true)}>Move</button>
      <button onClick={() => setShowDeleteModal(true)}>Delete</button>

      {showCreateModal && (
        <div>
          <h4>Create New Item</h4>
          <input
            type="text"
            placeholder="Item Name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
          <select value={newFileType} onChange={(e) => setNewFileType(e.target.value as "file" | "folder")}>
            <option value="file">File</option>
            <option value="folder">Folder</option>
          </select>
          <button onClick={createNewItem}>Create</button>
          <button onClick={() => setShowCreateModal(false)}>Cancel</button>
        </div>
      )}

      {showRenameModal && (
        <div>
          <h4>Rename Item</h4>
          {selectedFile ? (
            <>
              <p>Renaming: {selectedFile.name}</p>
              <input
                type="text"
                value={renamedFileName}
                onChange={(e) => setRenamedFileName(e.target.value)}
              />
              <button onClick={renameItem}>Rename</button>
              <button onClick={() => setShowRenameModal(false)}>Cancel</button>
            </>
          ) : (
            <>
              <p>Please select an item from the list to rename.</p>
              <button onClick={() => setShowRenameModal(false)}>Close</button>
            </>
          )}
        </div>
      )}

      {showDeleteModal && (
        <div>
          <h4>Confirm Delete</h4>
          {fileToDelete ? (
            <>
              <p>Are you sure you want to delete "{fileToDelete.name}"?</p>
              <button onClick={deleteItem}>Delete</button>
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </>
          ) : (
            <>
              <p>Please select an item from the list to delete.</p>
              <button onClick={() => setShowDeleteModal(false)}>Close</button>
            </>
          )}
        </div>
      )}

      {showMoveModal && (
        <div>
          <h4>Move Item</h4>
          {fileToMove ? (
            <>
              <p>Moving: {fileToMove.name}</p>
              <input
                type="text"
                placeholder="Destination Path"
                value={destinationPath}
                onChange={(e) => setDestinationPath(e.target.value)}
              />
              <button onClick={moveItem}>Move</button>
              <button onClick={() => setShowMoveModal(false)}>Cancel</button>
            </>
          ) : (
            <>
              <p>Please select an item from the list to move.</p>
              <button onClick={() => setShowMoveModal(false)}>Close</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;