<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProjectFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProjectFileController extends Controller
{
    /**
     * عرض جميع الملفات الخاصة بمشروع معين أو كل الملفات
     */
    public function index(Request $request)
    {
        $projectId = $request->query('project_id');

        $files = ProjectFile::when($projectId, function($query) use ($projectId) {
            $query->where('project_id', $projectId);
        })->with('project', 'uploader')->get();

        return response()->json($files);
    }

    /**
     * رفع ملف جديد
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|max:10240', // الحد الأقصى 10MB
            'project_id' => 'required|exists:projects,id',
            'shared' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $path = $file->store('project_files'); // سيتم حفظه في storage/app/project_files

        $projectFile = ProjectFile::create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'type' => $file->getClientOriginalExtension(),
            'size' => $file->getSize(),
            'project_id' => $request->project_id,
            'uploaded_by' => $request->user()->id, // تأكد أن المستخدم مسجل دخول
            'shared' => $request->shared ?? false,
        ]);

        return response()->json($projectFile, 201);
    }

    /**
     * عرض ملف معين
     */
    public function show($id)
    {
        $file = ProjectFile::with('project', 'uploader')->findOrFail($id);
        return response()->json($file);
    }

    /**
     * تحديث ملف (مثل مشاركة الملف)
     */
    public function update(Request $request, $id)
    {
        $file = ProjectFile::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'shared' => 'boolean',
            'name' => 'string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file->update($request->only(['shared', 'name']));

        return response()->json($file);
    }

    /**
     * حذف ملف
     */
    public function destroy($id)
    {
        $file = ProjectFile::findOrFail($id);

        // حذف الملف من التخزين أولاً
        if (Storage::exists($file->path)) {
            Storage::delete($file->path);
        }

        $file->delete();

        return response()->json(['message' => 'File deleted successfully']);
    }

    /**
     * تحميل ملف وزيادة عدد التحميلات
     */
    public function download($id)
    {
        $file = ProjectFile::findOrFail($id);

        if (!Storage::exists($file->path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // زيادة عدد التحميلات
        $file->increment('downloads');

        return Storage::download($file->path, $file->name);
    }
}
