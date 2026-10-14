import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, createToken, setAuthCookie, checkRateLimit } from '@/lib/auth';
import { createUser, getUserByUsername } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const rateCheck = checkRateLimit(`register:${ip}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'عدد المحاولات كبير جداً، يرجى الانتظار قليلاً.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    // Strict requirements: Username and password only, NO artificial complexity restrictions (even 1 char allowed)
    if (!username || typeof username !== 'string' || !username.trim()) {
      return NextResponse.json(
        { success: false, error: 'اسم المستخدم مطلوب.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'كلمة المرور مطلوبة.' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();

    // Check if user already exists
    const existing = await getUserByUsername(cleanUsername);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'اسم المستخدم مسجل مسبقاً، يرجى اختيار اسم آخر أو تسجيل الدخول.' },
        { status: 409 }
      );
    }

    // Hash password with strong bcrypt
    const passwordHash = await hashPassword(password);

    // Save to database
    const user = await createUser(cleanUsername, passwordHash);

    // Generate session token and set secure HttpOnly cookie
    const token = createToken({ id: user.id, username: user.username });
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء إنشاء الحساب.' },
      { status: 500 }
    );
  }
}
