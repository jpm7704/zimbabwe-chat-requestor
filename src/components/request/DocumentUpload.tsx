
import { UploadCloud, X, FileText, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestTypeInfo, DocumentType } from "@/types";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { uploadDocument } from "@/services/api/requestMutationApi";
import { Progress } from "@/components/ui/progress";

interface DocumentUploadProps {
  requestId?: string;
  requestTypeInfo: RequestTypeInfo | null;
  selectedFiles: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  onUploadSuccess?: () => void;
}

const DocumentUpload = ({ 
  requestId,
  requestTypeInfo, 
  selectedFiles, 
  handleFileChange, 
  removeFile,
  onUploadSuccess
}: DocumentUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  if (!requestTypeInfo) return null;

  const handleUploadFiles = async () => {
    if (!requestId || selectedFiles.length === 0) {
      toast({
        title: "Upload error",
        description: "Request ID is missing or no files selected",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setCurrentFileIndex(0);
    setProgress(0);
    
    let successCount = 0;
    
    for (let i = 0; i < selectedFiles.length; i++) {
      setCurrentFileIndex(i);
      
      // Find matching document type or use default
      const file = selectedFiles[i];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      let docType: DocumentType = 'other';
      
      if (fileExt === 'pdf' || fileExt === 'doc' || fileExt === 'docx') {
        docType = 'supporting_letter';
      } else if (fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'png') {
        docType = 'id_document';
      }
      
      try {
        // Update progress for current file
        setProgress(0);
        
        // Simulate progress during upload
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 200);
        
        const result = await uploadDocument(requestId, file, docType);
        
        clearInterval(progressInterval);
        setProgress(100);
        
        if (result) {
          successCount++;
        }
        
        // Small delay to show completed progress
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
      }
    }
    
    // All uploads completed
    setUploading(false);
    
    if (successCount === selectedFiles.length) {
      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${successCount} file${successCount !== 1 ? 's' : ''}.`
      });
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } else if (successCount > 0) {
      toast({
        title: "Upload partially complete",
        description: `Uploaded ${successCount} of ${selectedFiles.length} files.`,
        variant: "default"
      });
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } else {
      toast({
        title: "Upload failed",
        description: "Failed to upload any files. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="border border-primary/10 rounded-md p-6 bg-secondary/10">
      <h4 className="font-serif text-xl mb-4 text-elegant">Required Documents</h4>
      <ul className="space-y-3 mb-6">
        {requestTypeInfo.requiredDocuments.map((doc, index) => (
          <li key={index} className="flex items-start">
            <span className={`text-xs px-2 py-0.5 rounded ${doc.required ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'} mr-2 mt-0.5`}>
              {doc.required ? 'Required' : 'Optional'}
            </span>
            <div>
              <p className="font-medium font-serif">{doc.name}</p>
              <p className="text-muted-foreground text-sm">{doc.description}</p>
            </div>
          </li>
        ))}
      </ul>
      
      <div>
        <label htmlFor="fileUpload" className="block text-sm font-medium font-serif mb-3">
          Upload Documents <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center justify-center border-2 border-dashed border-primary/20 rounded-md p-8 transition-colors hover:border-primary/40 cursor-pointer bg-background">
          <label htmlFor="fileUpload" className="cursor-pointer text-center">
            <UploadCloud className="h-10 w-10 mx-auto text-primary/60 mb-4" />
            <p className="text-base font-serif mb-2">Drag and drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground">Supported formats: PDF, DOCX, JPEG, PNG</p>
            <Button variant="outline" size="sm" className="mt-4 font-serif" disabled={uploading}>
              <FilePlus className="h-4 w-4 mr-2" />
              Select Files
            </Button>
            <input
              id="fileUpload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h5 className="text-sm font-medium font-serif mb-3">Selected Files ({selectedFiles.length})</h5>
          
          {uploading && (
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading: {selectedFiles[currentFileIndex].name}</span>
                <span>{currentFileIndex + 1} of {selectedFiles.length}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-card/60 rounded-md p-3 text-sm border border-primary/10">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-primary mr-2" />
                  <span className="truncate max-w-[200px] font-serif">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          
          {requestId && selectedFiles.length > 0 && !uploading && (
            <Button 
              className="w-full mt-4"
              onClick={handleUploadFiles}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
