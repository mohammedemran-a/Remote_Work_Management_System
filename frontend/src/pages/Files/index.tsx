// src/pages/Files/index.tsx
import { useFilesState } from "./useFilesState";
import FilesUI from "./FilesUI";
import FilesDialogs from "./FilesDialogs";

const Files = () => {
  const filesState = useFilesState();

  return (
    <div dir="rtl" className="space-y-8">
      <FilesUI {...filesState} />
      <FilesDialogs {...filesState} />
    </div>
  );
};

export default Files;
