import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'overlays');
    
    // Check if directory exists
    try {
      await stat(uploadsDir);
    } catch {
      // Directory doesn't exist, return empty array
      return NextResponse.json([]);
    }

    const files = await readdir(uploadsDir);
    const overlays = [];

    for (const file of files) {
      // Skip non-image files
      if (!file.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
        continue;
      }

      const filePath = join(uploadsDir, file);
      const stats = await stat(filePath);
      
      // Extract ID from filename (format: overlay-timestamp-randomId.ext)
      const match = file.match(/^overlay-(\d+)-([^.]+)\./);
      if (match) {
        const [, timestamp, randomId] = match;
        const id = `custom-${timestamp}-${randomId}`;
        const name = file.replace(/^overlay-\d+-[^.]+\./, '').replace(/\.[^/.]+$/, '');
        
        overlays.push({
          id,
          name,
          fileName: file,
          path: `/uploads/overlays/${file}`,
          uploadedAt: new Date(stats.birthtime).toISOString(),
          size: stats.size,
          type: `image/${file.split('.').pop()}`
        });
      }
    }

    // Sort by upload date (newest first)
    overlays.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json(overlays);
  } catch (error) {
    console.error('Error listing overlays:', error);
    return NextResponse.json({ error: 'Failed to list overlays' }, { status: 500 });
  }
}
