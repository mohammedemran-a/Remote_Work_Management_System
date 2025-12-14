//مكون شريط البحث والفلاتر
// src/pages/Team/TeamFilters.tsx
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterDepartment: string;
  setFilterDepartment: (value: string) => void;
  filterRole: string;
  setFilterRole: (value: string) => void;
  departments: string[];
  roles: string[];
}

export const TeamFilters = ({ searchTerm, setSearchTerm, filterDepartment, setFilterDepartment, filterRole, setFilterRole, departments, roles }: Props) => (
  <div className="flex flex-col sm:flex-row gap-4">
    <div className="relative flex-1">
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input placeholder="البحث..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10 text-right" />
    </div>
    <Select value={filterDepartment} onValueChange={setFilterDepartment}><SelectTrigger className="w-[180px]"><SelectValue placeholder="القسم" /></SelectTrigger><SelectContent><SelectItem value="all">جميع الأقسام</SelectItem>{departments.map(dept => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}</SelectContent></Select>
    <Select value={filterRole} onValueChange={setFilterRole}><SelectTrigger className="w-[180px]"><SelectValue placeholder="الدور" /></SelectTrigger><SelectContent><SelectItem value="all">جميع الأدوار</SelectItem>{roles.map(role => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent></Select>
  </div>
);

export default TeamFilters;
