// src/pages/Users/UsersStats.tsx

import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, UserCheck } from "lucide-react";
import { User } from "@/api/users";
import { Role } from "@/api/roles";

interface UsersStatsProps {
  users: User[];
  roles: Role[];
}

export const UsersStats = ({ users, roles }: UsersStatsProps) => {
  const adminCount = users.filter((user) =>
    user.roles.some(
      (role) =>
        role.name.toLowerCase() === "admin" ||
        role.name.toLowerCase() === "super-admin"
    )
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* بطاقة إجمالي المستخدمين */}
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <Users className="h-8 w-8 text-primary" />
        </CardContent>
      </Card>

      {/* بطاقة عدد الأدوار */}
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">عدد الأدوار</p>
            <p className="text-2xl font-bold">{roles.length}</p>
          </div>
          <Shield className="h-8 w-8 text-purple-600" />
        </CardContent>
      </Card>

      {/* بطاقة عدد المشرفين */}
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">عدد المشرفين</p>
            <p className="text-2xl font-bold">{adminCount}</p>
          </div>
          <UserCheck className="h-8 w-8 text-green-600" />
        </CardContent>
      </Card>
    </div>
  );
};
