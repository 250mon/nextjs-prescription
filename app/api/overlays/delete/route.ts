import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(request: NextRequest) {
  try {
    const { fileName } = await request.json();
    
    if (!fileName) {
      return NextResponse.json({ error: 'No file name provided' }, { status: 400 });
    }

    // Construct file path
    const filePath = join(process.cwd(), 'public', 'uploads', 'overlays', fileName);

    // Delete the file
    await unlink(filePath);

    return NextResponse.json({ success: true, message: 'Overlay deleted successfully' });
  } catch (error) {
    console.error('Error deleting overlay:', error);
    return NextResponse.json({ error: 'Failed to delete overlay' }, { status: 500 });
  }
}
