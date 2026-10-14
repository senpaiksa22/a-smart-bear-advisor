import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createToken, setAuthCookie, checkRateLimit } from '@/lib/auth';
import { getUserByUsername } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const rateCheck = checkRateLimit(`login:${ip}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'تم تجاوز عدد محاولات الدخول المسموح بها، يرجى الانتظار دقيقة واحدة.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال اسم المستخدم وكلمة المرور.' },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim();
    const user = await getUserByUsername(cleanUsername);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' },
        { status: 401 }
      );
    }

    // Verify bcrypt password hash
    const isValid = await verifyPassword(String(password), user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' },
        { status: 401 }
      );
    }

    // Generate session token and set secure HttpOnly cookie
    const token = createToken({ id: user.id, username: user.username });
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء تسجيل الدخول.' },
      { status: 500 }
    );
  }
}
