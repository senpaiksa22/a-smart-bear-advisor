import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthUserFromRequest,
  hashPassword,
  verifyPassword,
  createToken,
  setAuthCookie,
  checkRateLimit,
} from '@/lib/auth';
import {
  getUserWithPasswordById,
  getUserByUsername,
  updateUsername,
  updateUserPassword,
} from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'يرجى تسجيل الدخول أولاً' }, { status: 401 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateCheck = checkRateLimit(`profile_${user.id}_${ip}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'محاولات كثيرة جداً، يرجى الانتظار دقيقة' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action } = body;

    // Fetch full user record
    const currentUser = await getUserWithPasswordById(user.id);
    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // --------------------------------------------------------------------------
    // ACTION 1: CHANGE USERNAME
    // --------------------------------------------------------------------------
    if (action === 'change_username') {
      const { newUsername } = body;
      if (!newUsername || typeof newUsername !== 'string') {
        return NextResponse.json({ success: false, error: 'اسم المستخدم مطلوب' }, { status: 400 });
      }

      const trimmed = newUsername.trim();
      if (trimmed.length < 3 || trimmed.length > 25) {
        return NextResponse.json(
          { success: false, error: 'يجب أن يكون اسم المستخدم بين 3 و 25 حرفاً' },
          { status: 400 }
        );
      }

      if (trimmed.toLowerCase() === currentUser.username.toLowerCase()) {
        return NextResponse.json(
          { success: true, user: { id: user.id, username: currentUser.username } }
        );
      }

      // Check if username is already taken by another user
      const existing = await getUserByUsername(trimmed);
      if (existing && existing.id !== user.id) {
        return NextResponse.json(
          { success: false, error: 'اسم المستخدم هذا مستخدم بالفعل من قبل شخص آخر' },
          { status: 409 }
        );
      }

      await updateUsername(user.id, trimmed);

      const updatedUser = { id: user.id, username: trimmed };
      const token = createToken(updatedUser);
      const response = NextResponse.json({
        success: true,
        message: 'تم تحديث اسم المستخدم بنجاح',
        user: updatedUser,
      });
      setAuthCookie(response, token);
      return response;
    }

    // --------------------------------------------------------------------------
    // ACTION 2: CHANGE PASSWORD (Frictionless for Authenticated User)
    // --------------------------------------------------------------------------
    if (action === 'change_password') {
      const { newPassword } = body;

      if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'يجب ألا تقل كلمة المرور الجديدة عن 6 خانات' },
          { status: 400 }
        );
      }

      const newHash = await hashPassword(newPassword);
      await updateUserPassword(user.id, newHash);

      return NextResponse.json({
        success: true,
        message: 'تم تغيير كلمة المرور بنجاح',
      });
    }

    return NextResponse.json({ success: false, error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error: any) {
    console.error('API profile update error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في معالجة الطلب' }, { status: 500 });
  }
}
