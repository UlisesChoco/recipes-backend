import { promises as fs } from 'fs';
import * as path from 'path';

export async function saveImage(image: any): Promise<string> {
    const uploadPath = path.join(process.cwd(), 'uploads');

    await fs.mkdir(uploadPath, { recursive: true });

    const fileName = `${Date.now()}-${image.originalname}`;
    const fullPath = path.join(uploadPath, fileName);

    await fs.writeFile(fullPath, image.buffer);

    return fileName;
}

export async function deleteImage(imagePath: string): Promise<void> {
    try {
        await fs.unlink(imagePath);
    } catch (err: any) {
        if (err.code !== 'ENOENT') throw err;
    }
}