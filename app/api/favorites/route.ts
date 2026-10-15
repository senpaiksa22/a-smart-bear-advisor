import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { getUserFavorites, saveUserFavorites } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized', favorites: [] }, { status: 401 });
    }

    const favorites = await getUserFavorites(user.id);
    return NextResponse.json(
      { success: true, favorites },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error: any) {
    console.error('API get favorites error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error', favorites: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { favorites } = body;

    if (!Array.isArray(favorites)) {
      return NextResponse.json({ success: false, error: 'Favorites must be an array of slugs' }, { status: 400 });
    }

    // Limit to reasonable maximum (e.g. 500 slugs)
    const sanitized = favorites.slice(0, 500).map(String);
    await saveUserFavorites(user.id, sanitized);

    return NextResponse.json({ success: true, favorites: sanitized });
  } catch (error: any) {
    console.error('API save favorites error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
