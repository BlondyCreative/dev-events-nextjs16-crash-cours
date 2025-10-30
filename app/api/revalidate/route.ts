import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { message: 'Missing path parameter' },
        { status: 400 }
      );
    }

    revalidatePath(path);

    return NextResponse.json(
      { message: `Path ${path} revalidated successfully` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Revalidation failed', error: String(error) },
      { status: 500 }
    );
  }
}
