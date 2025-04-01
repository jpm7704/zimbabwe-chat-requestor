
import { FileList } from '@/components/request/FileList';
import FileUpload from '@/components/request/FileUpload';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Document } from '@/types';
import { getRequestDocuments } from '@/services/requestService';

interface RequestDocumentsProps {
  requestId: string;
}

const RequestDocuments = ({ requestId }: RequestDocumentsProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  
  const handleDocumentsChange = async () => {
    // This will be called after a document is uploaded or deleted
    // We'll refresh the file list
    try {
      const updatedDocs = await getRequestDocuments(requestId);
      setDocuments(updatedDocs);
    } catch (error) {
      console.error("Error refreshing documents:", error);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Documents</h3>
        <p className="text-sm text-muted-foreground mb-4">
          View and manage documents related to this request.
        </p>
        
        <FileList 
          requestId={requestId} 
          canDelete={true}
          onDocumentsChange={handleDocumentsChange}
        />
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload additional documents to this request.
        </p>
        
        <FileUpload 
          requestId={requestId}
          initialFiles={documents}
          onUploadSuccess={handleDocumentsChange}
        />
      </div>
    </div>
  );
};

export default RequestDocuments;
