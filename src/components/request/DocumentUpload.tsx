
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequestTypeInfo } from "@/types";

interface DocumentUploadProps {
  requestTypeInfo: RequestTypeInfo | null;
  selectedFiles: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
}

const DocumentUpload = ({ 
  requestTypeInfo, 
  selectedFiles, 
  handleFileChange, 
  removeFile 
}: DocumentUploadProps) => {
  if (!requestTypeInfo) return null;

  return (
    <div className="border border-border rounded-md p-4 bg-secondary/50">
      <h4 className="font-medium mb-2">Required Documents</h4>
      <ul className="space-y-2 mb-4">
        {requestTypeInfo.requiredDocuments.map((doc, index) => (
          <li key={index} className="flex items-start">
            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary mr-2 mt-0.5">
              {doc.required ? 'Required' : 'Optional'}
            </span>
            <div>
              <p className="font-medium text-sm">{doc.name}</p>
              <p className="text-muted-foreground text-xs">{doc.description}</p>
            </div>
          </li>
        ))}
      </ul>
      
      <div>
        <label htmlFor="fileUpload" className="block text-sm font-medium mb-2">
          Upload Documents <span className="text-destructive">*</span>
        </label>
        <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-md p-6 transition-colors hover:border-primary/50 cursor-pointer">
          <label htmlFor="fileUpload" className="cursor-pointer text-center">
            <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Drag and drop files here or click to browse</p>
            <p className="text-xs text-muted-foreground">Supported formats: PDF, DOCX, JPEG, PNG</p>
            <input
              id="fileUpload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h5 className="text-sm font-medium mb-2">Selected Files ({selectedFiles.length})</h5>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between bg-secondary/80 rounded-md p-2 text-sm">
                <span className="truncate max-w-[200px]">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
