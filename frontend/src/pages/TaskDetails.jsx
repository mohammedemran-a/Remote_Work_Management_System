import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ✅✅✅====== التعديل الأول والأساسي: إصلاح مسارات الاستيراد ======✅✅✅
import { api } from '@/api/axios'; // تصحيح المسار لاستخدام النسخة الصحيحة من api
import { useAuthStore } from '@/store/useAuthStore'; // استخدام zustand بدلاً من AuthContext

// مكون بسيط لعرض شاشة تحميل
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// مكون لعرض رسالة خطأ
const ErrorMessage = ({ message }) => (
  <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
    <p>حدث خطأ:</p>
    <p>{message}</p>
  </div>
);

const TaskDetails = () => {
  // ✅✅✅====== التعديل الثاني: تغيير اسم المتغير ليتوافق مع App.tsx ======✅✅✅
  const { id } = useParams(); // استخدام 'id' بدلاً من 'taskId'
  const navigate = useNavigate();
  
  // ✅✅✅====== التعديل الثالث: استخدام zustand لجلب المستخدم ======✅✅✅
  const { user } = useAuthStore(); 

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- جلب بيانات المهمة عند تحميل الصفحة ---
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        // استخدام 'id' في الرابط
        const response = await api.get(`/tasks/${id}`);
        // الـ API الخاص بك يرجع البيانات مباشرة
        setTask(response.data); 
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'فشل في جلب بيانات المهمة.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]); // يتم التنفيذ كلما تغير id

  // --- دالة لتسليم المهمة للمراجعة ---
  const handleSubmitForReview = async () => {
    if (!window.confirm('هل أنت متأكد أنك تريد تسليم هذه المهمة للمراجعة؟')) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post(`/tasks/${id}/submit-review`);
      
      // تحديث حالة المهمة محليًا لعرض التغيير فورًا
      setTask(prevTask => ({ ...prevTask, status: 'قيد المراجعة' }));
      
      alert('تم تسليم المهمة للمراجعة بنجاح!');

    } catch (err) {
      alert('حدث خطأ أثناء تسليم المهمة.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- عرض شاشة التحميل أو الخطأ أو التفاصيل ---
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!task) {
    return <div className="text-center">لم يتم العثور على المهمة.</div>;
  }

  // التحقق إذا كان المستخدم الحالي هو المسؤول عن المهمة
  const isAssignee = user && task.assignee && user.id === task.assignee.id;

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">تفاصيل المهمة: {task.title}</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><strong>الوصف:</strong> <p className="whitespace-pre-wrap">{task.description}</p></div>
          {/* ملاحظة: API الخاص بك لا يرسل status_text أو start_date */}
          <div><strong>الحالة:</strong> <span className={`px-2 py-1 rounded-full text-sm`}>{task.status}</span></div>
          <div><strong>المشروع:</strong> {task.project?.name || 'غير محدد'}</div>
          <div><strong>المسؤول:</strong> {task.assignee?.name || 'غير محدد'}</div>
          <div><strong>تاريخ الإنشاء:</strong> {task.created_at ? new Date(task.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}</div>
          <div><strong>تاريخ الاستحقاق:</strong> {task.due_date ? new Date(task.due_date).toLocaleDateString('ar-EG') : 'غير محدد'}</div>
        </div>

        <div className="mt-6 border-t pt-4">
          {/* ملاحظة: API الخاص بك يرسل 'قيد التنفيذ' وليس 'in_progress' */}
          {isAssignee && task.status === 'قيد التنفيذ' && (
            <button
              onClick={handleSubmitForReview}
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            >
              {isSubmitting ? 'جاري التسليم...' : 'تسليم للمراجعة'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
