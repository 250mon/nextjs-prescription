import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'overlays');
    
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, which is fine
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const fileExtension = file.name.split('.').pop();
    const fileName = `overlay-${timestamp}-${randomId}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return file info
    const overlayInfo = {
      id: `custom-${timestamp}-${randomId}`,
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      fileName: fileName,
      path: `/uploads/overlays/${fileName}`,
      uploadedAt: new Date().toISOString(),
      size: file.size,
      type: file.type
    };

    return NextResponse.json(overlayInfo);
  } catch (error) {
    console.error('Error uploading overlay:', error);
    return NextResponse.json({ error: 'Failed to upload overlay' }, { status: 500 });
  }
}
