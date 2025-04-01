import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FilePlus, Upload, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Document } from "@/types";
import { uploadDocument } from "@/services/api/requestMutationApi";

interface FileUploadProps {
  requestId: string;
  onUploadSuccess?: () => void;
  initialFiles?: Document[];
}

const FileUpload = ({ requestId, onUploadSuccess, initialFiles = [] }: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<Document[]>(initialFiles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleUpload(acceptedFiles);
  }, [requestId, handleUpload]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });
  
  // Update drag active state
  useState(() => {
    if (isDragActive) {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  }, [isDragActive]);

  const handleUpload = async (files: File[]) => {
    try {
      setLoading(true);
      setError(null);
      
      for (const file of files) {
        const result = await uploadDocument(requestId, file, 'supporting_document');
        if (result) {
          setUploadedFiles(prev => [...prev, result]);
        }
      }
      
      // Notify onUploadSuccess with the new files
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      
      toast({
        title: "Upload successful",
        description: `${files.length} file(s) uploaded successfully.`,
      });
      
    } catch (error: any) {
      console.error("File upload error:", error);
      setError(error.message || "An unexpected error occurred");
      toast({
        title: "Upload failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div 
        {...getRootProps()} 
        className={`relative border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center ${dragActive ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/20 bg-background hover:border-primary/50 transition-colors'}`}
      >
        <Input {...getInputProps()} id="upload" className="hidden" />
        <div className="text-center">
          <FilePlus className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
          <Label htmlFor="upload" className="cursor-pointer text-sm font-medium">
            {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Supported formats: JPEG, PNG, GIF, PDF, DOC, DOCX
          </p>
        </div>
      </div>
      
      {uploadedFiles.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium">Uploaded Files</h4>
          <ul className="space-y-2">
            {uploadedFiles.map((file) => (
              <li key={file.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                  {file.name}
                </a>
                <Button variant="outline" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
