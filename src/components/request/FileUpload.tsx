
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { DocumentType } from '@/types';
import { uploadDocument } from '@/services/api/requestMutationApi';

interface FileUploadProps {
  requestId: string;
  documentType: DocumentType;
  onUploadComplete: (success: boolean) => void;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
}

export function FileUpload({
  requestId,
  documentType,
  onUploadComplete,
  maxSizeMB = 10,
  acceptedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `File size exceeds the ${maxSizeMB}MB limit.`,
          variant: 'destructive',
        });
        return;
      }
      
      // Validate file type
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(fileExtension)) {
        toast({
          title: 'Invalid file type',
          description: `Please upload one of the following file types: ${acceptedFileTypes.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setProgress(10); // Start progress
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prevProgress => {
          if (prevProgress >= 95) {
            clearInterval(progressInterval);
            return prevProgress;
          }
          return prevProgress + 5;
        });
      }, 200);
      
      const result = await uploadDocument(requestId, selectedFile, documentType);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result) {
        toast({
          title: 'Upload successful',
          description: `${selectedFile.name} has been uploaded.`,
        });
        onUploadComplete(true);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      onUploadComplete(false);
    } finally {
      setTimeout(() => {
        setUploading(false);
        setSelectedFile(null);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="document">Document</Label>
        <div className="flex items-center gap-2">
          <Input
            id="document"
            type="file"
            className={selectedFile ? 'hidden' : ''}
            onChange={handleFileChange}
            accept={acceptedFileTypes.join(',')}
            disabled={uploading}
          />
          
          {selectedFile && (
            <div className="flex items-center w-full p-2 bg-secondary/20 rounded-md">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm truncate flex-1">{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                disabled={uploading}
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {selectedFile && (
        <div className="space-y-2">
          {uploading ? (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {progress < 100 ? 'Uploading...' : 'Upload complete'}
              </p>
            </div>
          ) : (
            <Button 
              onClick={handleUpload} 
              className="w-full"
              disabled={!selectedFile}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          )}
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Max file size: {maxSizeMB}MB. Accepted formats: {acceptedFileTypes.join(', ')}
      </p>
    </div>
  );
}
