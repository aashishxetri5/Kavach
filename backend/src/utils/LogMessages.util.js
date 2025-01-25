const logMessages = {
  login: () => `Logged in successfully.`,
  registration: (newUsername, role) =>
    `Registered a new user ${newUsername} with role ${role}.`,
  logout: () =>
    `Logged out at ${new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })}.`,

  fileUpload: (fileName) => `Uploaded file ${fileName}.`,
  fileDownload: (fileName) => `Downloaded file ${fileName}.`,

  fileTrash: (fileName) => `Moved file ${fileName} to trash.`,
  trashCleanup: () => `User cleared the trash.`,
  fileRestore: (fileName) => `Restored file ${fileName} from trash.`,
  fileDelete: (fileName) => `Deleted file ${fileName}.`,

  passwordChange: () => `Changed their password.`,
  profileUpdate: () => `Updated their profile details.`,

  fileShare: (fileName, sharedWithUsername) =>
    `Shared file ${fileName} with ${sharedWithUsername}.`,
};

module.exports = { logMessages };
