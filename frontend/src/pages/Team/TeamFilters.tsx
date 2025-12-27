// src/pages/Team/TeamFilters.tsx
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  // أزلنا فلاتر الأقسام والأدوار مؤقتاً لأنها تتبع الموظفين وليس الفرق
}

export const TeamFilters = ({ searchTerm, setSearchTerm }: Props) => (
  <div className="flex flex-col sm:flex-row gap-4">
    <div className="relative flex-1">
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input 
        placeholder="ابحث عن اسم الفريق أو القائد..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="pr-10 text-right" 
      />
    </div>
    
    {/* يمكن إضافة فلتر لاحقاً بناءً على حالة الفريق (نشط/مكتمل) */}
    <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-md text-sm text-muted-foreground">
      <Users className="h-4 w-4" />
      <span>تصفية حسب الفريق</span>
    </div>
  </div>
);