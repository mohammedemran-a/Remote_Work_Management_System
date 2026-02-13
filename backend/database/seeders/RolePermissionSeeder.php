<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            "dashboard_access",
            "dashboard_view",
            "users_view",
            "users_create",
            "users_edit",
            "users_delete",
            "roles_view",
            "roles_create",
            "roles_edit",
            "roles_delete",
            "notifications_view",
            "notifications_delete",
            "settings_view",
            "settings_edit",
            "projects_view",
            "projects_view_all",
            "projects_create",
            "projects_edit",
            "projects_delete",
            "tasks_view",
            "tasks_view_all", 
            "tasks_create",
            "tasks_edit",
            "tasks_delete",
            "calendar_view",
            "calendar_create",
            "calendar_edit",
            "calendar_delete",
            "files_view",
            "files_view_all",   
            "files_create",
            "files_edit",
            "files_delete",
            "activities_view",
            "activities_delete",
            "teams_view",
            "teams_view_all",
            "teams_create",
            "teams_edit",
            "teams_delete",
        ];

        // 🔹 إنشاء الصلاحيات
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 🔹 إنشاء الأدوار
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole  = Role::firstOrCreate(['name' => 'user']);

        // 🔹 المدير يحصل على جميع الصلاحيات
        $adminRole->givePermissionTo(Permission::all());

        // 🔹 المستخدم بدون صلاحيات — يمكن تعديلها لاحقًا من لوحة التحكم
        $userRole->syncPermissions([]);

        // 🔹 إنشاء حساب المدير الأساسي
        $admin = User::firstOrCreate(
            ['email' => '@gmail.coadminm'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('12345678'),
            ]
        );

        $admin->assignRole('admin');

        $this->command->info('Roles & permissions seeded. Admin has all permissions, user has none.');
    }
}

