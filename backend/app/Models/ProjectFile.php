<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectFile extends Model
{
    //
      protected $table = 'project_files';
      protected $fillable = [
        'name',
        'path',
        'type',
        'size',
        'project_id',
        'uploaded_by',
        'shared',
        'downloads',
    ];

    /**
     * المشروع الذي ينتمي إليه الملف
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * المستخدم الذي رفع الملف
     */
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * تحويل الحجم إلى صيغة مقروءة (اختياري)
     */
    public function getReadableSizeAttribute()
    {
        $bytes = $this->size;
        $sizes = ['B','KB','MB','GB','TB'];
        $factor = $bytes > 0 ? floor(log($bytes, 1024)) : 0;
        return sprintf("%.2f", $bytes / pow(1024, $factor)) . ' ' . $sizes[$factor];
    }
}
