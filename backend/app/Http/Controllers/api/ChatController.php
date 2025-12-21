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
}
