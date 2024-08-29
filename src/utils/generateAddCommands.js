// src/utils/generateAddCommands.js

export function generateAddCommandsLogic(folderInput, filesInput) {
  const folderLines = folderInput
    .split("\n")
    .filter((line) => line.trim() !== "");
  const fileLines = filesInput.split("\n").filter((line) => line.trim() !== "");

  if (folderLines.length === 0 || fileLines.length === 0) {
    return {
      success: false,
      message: "Please provide both folder and file inputs.",
    };
  }

  const folderParts = folderLines[0].split(/\s+/);
  let folderName = folderParts.slice(0, -2).join(" ").trim();
  const folderCid = folderParts[folderParts.length - 2].trim();

  // Remove trailing slash from folder name if it exists
  if (folderName.endsWith("/")) {
    folderName = folderName.slice(0, -1);
  }

  let output = "";

  fileLines.forEach((line) => {
    const fileParts = line.split(/\s+/);
    const fileName = fileParts.slice(0, -2).join(" ").trim();
    const fileCid = fileParts[fileParts.length - 2].trim();
    output += `added ${fileCid} ${folderName}/${fileName}\n`;
  });

  output += `added ${folderCid} ${folderName}`;

  return { success: true, output };
}
