import fs from "fs/promises";

class FileService {
  async moveFile(file, dest) {
    const { path } = file;
    const [, extension] = path.split(".");
    const newPath = `${dest}.${extension}`;
    await fs.rename(path, newPath);
    return newPath;
  }
}

export const fileService = new FileService();
