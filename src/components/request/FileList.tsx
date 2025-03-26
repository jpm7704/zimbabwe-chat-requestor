
import { useState, useEffect } from 'react';
import { Document as RequestDocument } from '@/types';
import { Button } from '@/components/ui/button';
import { FileText, Download, Trash2, ExternalLink } from 'lucide-react';
import { getRequestDocuments, deleteDocument } from '@/services/api/requestMutationApi';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface FileListProps {
  requestId: string;
  canDelete?: boolean;
  onDocumentsChange?: () => void;
}

export function FileList({ requestId, canDelete = false, onDocumentsChange }: FileListProps) {
  const [documents, setDocuments] = useState<RequestDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getRequestDocuments(requestId);
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [requestId]);

  const handleDelete = async (documentId: string) => {
    setDeletingId(documentId);
    try {
      const success = await deleteDocument(documentId);
      if (success) {
        setDocuments(docs => docs.filter(doc => doc.id !== documentId));
        toast({
          title: 'Document deleted',
          description: 'The document has been successfully deleted.',
        });
        if (onDocumentsChange) {
          onDocumentsChange();
        }
      } else {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the document',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No documents have been uploaded yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map(document => (
        <div 
          key={document.id} 
          className="flex items-center justify-between p-3 bg-secondary/10 rounded-md border border-border"
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="font-medium text-sm truncate">{document.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(document.uploadedAt)}
              </p>
            </div>
          </div>

          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8"
            >
              <a href={document.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8"
            >
              <a href={document.url} download={document.name}>
                <Download className="h-4 w-4" />
              </a>
            </Button>
            
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    disabled={deletingId === document.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Document</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this document? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(document.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
