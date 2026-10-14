import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { getConversationById, getMessages, deleteConversation } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const conversation = await getConversationById(user.id, id);
    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'المحادثة غير موجودة أو غير مصرح لك بالوصول إليها' },
        { status: 404 }
      );
    }

    const messages = await getMessages(user.id, id);

    return NextResponse.json({
      success: true,
      conversation,
      messages,
    });
  } catch (error: any) {
    console.error('Error fetching conversation messages:', error);
    return NextResponse.json(
      { success: false, error: 'تعذر جلب رسائل المحادثة' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const deleted = await deleteConversation(user.id, id);

    return NextResponse.json({
      success: true,
      message: 'تم حذف المحادثة بنجاح',
    });
  } catch (error: any) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { success: false, error: 'تعذر حذف المحادثة' },
      { status: 500 }
    );
  }
}
