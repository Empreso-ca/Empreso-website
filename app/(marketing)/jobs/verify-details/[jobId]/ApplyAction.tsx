'use client';
import { createApplication } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';

export default function ApplyActions({
  userId,
  jobId,
  newResume,
  refresh,
}: {
  userId: string;
  jobId: number;
  newResume?: File;
  refresh: () => void;
}) {
  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleApply = async () => {
    const formData = new FormData();

    formData.append("userId", userId);
    formData.append("jobId", String(jobId));

    if (newResume) {
      formData.append("newResume", newResume);
    }

    await createApplication(formData);
    refresh();
  };

  return (
    <div className="w-full">
      {newResume && (
        <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
          <div>
            <p className="font-medium">{newResume.name}</p>
            <p className="text-xs text-muted-foreground">
              File Size: {formatFileSize(newResume.size)}
            </p>
          </div>
        </div>
      )}

      <Button onClick={handleApply} className="w-full mt-4">
        Apply Now
      </Button>
    </div>
  );
}