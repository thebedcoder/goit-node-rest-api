import path from "path";
import fs from "fs/promises";

class FileService {
  async moveFile(file, dest) {
    const { path: filePath } = file;
    const extension = path.extname(filePath).slice(1);
    const newPath = `${dest}.${extension}`;
    await fs.rename(filePath, newPath);
    return newPath;
  }
}

export const fileService = new FileService();
