// src/pages/Users/UsersTable.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { User } from "@/api/users";
import { useAuthStore } from "@/store/useAuthStore";

// واجهة الخصائص (Props) التي يتلقاها المكون
interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export const UsersTable = ({ users, onEdit, onDelete }: UsersTableProps) => {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const canEdit = hasPermission("users_edit");
  const canDelete = hasPermission("users_delete");

  // دالة للحصول على الأحرف الأولى من الاسم
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>قائمة المستخدمين</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المستخدم</TableHead>
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">القسم</TableHead>
              <TableHead className="text-right">الدور</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {/* خلية المستخدم (الأفاتار والاسم) */}
                <TableCell className="flex items-center gap-3 font-medium">
                  <Avatar>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  {user.name}
                </TableCell>

                {/* خلية البريد الإلكتروني */}
                <TableCell className="text-muted-foreground">{user.email}</TableCell>

                {/* خلية القسم */}
                <TableCell className="text-muted-foreground">
                  {user.department || "غير محدد"}
                </TableCell>

                {/* خلية الدور */}
                <TableCell>
                  {user.roles.map((role) => (
                    <span
                      key={role.id}
                      className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full"
                    >
                      {role.name}
                    </span>
                  ))}
                </TableCell>

                {/* خلية الإجراءات */}
                <TableCell className="text-center">
                  {(canEdit || canDelete) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {canEdit && (
                          <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Edit className="ml-2 h-4 w-4" />
                            تعديل
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <DropdownMenuItem
                            onClick={() => onDelete(user.id)}
                            className="text-red-600 focus:text-red-500"
                          >
                            <Trash2 className="ml-2 h-4 w-4" />
                            حذف
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            لا يوجد مستخدمون لعرضهم.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
