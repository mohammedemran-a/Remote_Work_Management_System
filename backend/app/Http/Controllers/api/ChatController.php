<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    // جلب كل محادثات المستخدم الحالي
    public function getConversations()
    {
        $user = Auth::user();
        // 🟢 التعديل الوحيد هنا: أضف 'users' إلى جملة with
        $conversations = $user->conversations()->with('project', 'latestMessage.user', 'users')->get();
        return response()->json(['data' => $conversations]);
    }

    // جلب رسائل محادثة معينة
    public function getMessages(Conversation $conversation)
    {
        if (!Auth::user()->conversations->contains($conversation)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $messages = $conversation->messages()->with('user')->get();
        return response()->json(['data' => $messages]);
    }

    // إرسال رسالة جديدة
    public function sendMessage(Request $request, Conversation $conversation)
    {
        if (!Auth::user()->conversations->contains($conversation)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate(['content' => 'required|string']);

        $message = $conversation->messages()->create([
            'user_id' => Auth::id(),
            'content' => $request->content,
            'type' => 'text',
        ]);

        $message->load('user');
        return response()->json(['data' => $message], 201);
    }

    // إنشاء محادثة جديدة
    public function createConversation(Request $request)
    {
        // 🟢 2. قم بإزالة 'name' من قواعد التحقق
        $request->validate([
            'project_id' => 'required|exists:projects,id',
            'member_ids' => 'required|array',
            'member_ids.*' => 'exists:users,id',
        ]);

        // 🟢 3. ابحث عن المشروع لتتمكن من استخدام اسمه
        $project = Project::find($request->project_id);

        // 🟢 4. قم بإنشاء اسم المحادثة تلقائيًا
        $conversationName = "فريق " . $project->name;

        // 🟢 5. قم بإنشاء المحادثة باستخدام الاسم الجديد
        $conversation = Conversation::create([
            'name' => $conversationName,
            'project_id' => $request->project_id,
        ]);

        // إضافة الأعضاء للمحادثة، بما في ذلك المستخدم الحالي
        $memberIds = array_unique(array_merge($request->member_ids, [Auth::id()]));
        $conversation->users()->attach($memberIds);

        $conversation->load('project', 'users');

        return response()->json(['data' => $conversation], 201);
    }

    // 🟢 إضافة أعضاء إلى محادثة موجودة
    public function addMembers(Request $request, Conversation $conversation)
    {
        // التأكد من أن المستخدم الحالي عضو في المحادثة
        if (!Auth::user()->conversations->contains($conversation)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // التحقق من صحة البيانات المرسلة
        $request->validate([
            'member_ids' => 'required|array',
            'member_ids.*' => 'exists:users,id',
        ]);

        // إضافة الأعضاء الجدد فقط (لتجنب التكرار)
        $conversation->users()->syncWithoutDetaching($request->member_ids);

        // تحميل البيانات المحدثة وإرسالها مرة أخرى
        $conversation->load('project', 'users');

        return response()->json(['data' => $conversation], 200);
    }

    /**
     * ✅✅✅====== دالة حذف الرسائل (واحدة أو متعددة) ======✅✅✅
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteMessages(Request $request)
    {
        // 1. التحقق من صحة البيانات المرسلة (يجب أن تكون مصفوفة من الأرقام)
        $validatedData = $request->validate([
            'message_ids'   => 'required|array',
            'message_ids.*' => 'integer|exists:messages,id', // التأكد من أن كل ID موجود في جدول الرسائل
        ]);

        $messageIds = $validatedData['message_ids'];
        $user = Auth::user();

        // 2. جلب الرسائل والتأكد من أن المستخدم الحالي هو من أرسلها
        // هذا يمنع مستخدم من حذف رسائل مستخدم آخر
        $messagesToDelete = Message::whereIn('id', $messageIds)
                                   ->where('user_id', $user->id)
                                   ->pluck('id'); // pluck للحصول على IDs فقط بكفاءة

        // 3. التحقق من الصلاحية: إذا كان عدد الرسائل التي يملكها المستخدم
        // لا يساوي عدد الرسائل المطلوب حذفها، فهذا يعني أنه يحاول حذف رسائل لا يملكها.
        if ($messagesToDelete->count() !== count($messageIds)) {
            return response()->json(['message' => 'لا يمكنك حذف رسائل لا تملكها.'], 403); // 403 Forbidden
        }

        // 4. تنفيذ الحذف فقط للرسائل التي تم التحقق من ملكيتها
        Message::whereIn('id', $messagesToDelete)->delete();

        // 5. إرجاع رسالة نجاح
        return response()->json(['message' => 'تم حذف الرسائل بنجاح.']);
    }
}
