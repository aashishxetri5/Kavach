const mimeToExtension = {
  "text/plain": "TXT",
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "DOCX",
  "application/vnd.ms-excel": "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "application/zip": "ZIP",
  "application/json": "JSON",
  "text/html": "HTML",
};

/**
 * Function to convert MIME type to file extension.
 *
 * @param {string} mimeType
 * @returns {string} file extension (uppercase)
 */
function getExtensionFromMimeType(mimeType) {
  return mimeToExtension[mimeType] || "unknown"; //unknown if mimtype not found
}

module.exports = { getExtensionFromMimeType };
