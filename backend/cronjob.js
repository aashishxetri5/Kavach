const fs = require("fs");
const path = require("path");
const File = require("./src/model/File.model");

const cron = require("node-cron");

// Schedule tasks to be run on the server every day at midnight
cron.schedule("0 0 0 * * *", () => {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const filesToDelete = File.find({
    is_deleted: true,
    deleted_at: { $lte: fourteenDaysAgo },
  });

  filesToDelete.forEach(async (file) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      await File.deleteOne({ _id: file._id });
    } catch (error) {
      console.error(error);
    }
  });
});
