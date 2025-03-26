
import { UploadCloud, X, FileText, FilePlus } from "lucide-react";
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
            <Button variant="outline" size="sm" className="mt-4 font-serif">
              <FilePlus className="h-4 w-4 mr-2" />
              Select Files
            </Button>
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
        <div className="mt-6">
          <h5 className="text-sm font-medium font-serif mb-3">Selected Files ({selectedFiles.length})</h5>
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
