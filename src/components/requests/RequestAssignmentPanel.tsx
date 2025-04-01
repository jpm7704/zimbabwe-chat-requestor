
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Request } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2, User } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface RequestAssignmentPanelProps {
  request: Request;
  onAssignmentChange: () => void;
}

const RequestAssignmentPanel = ({ request, onAssignmentChange }: RequestAssignmentPanelProps) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [fieldOfficers, setFieldOfficers] = useState<StaffMember[]>([]);
  const [programManagers, setProgramManagers] = useState<StaffMember[]>([]);
  const [selectedFieldOfficer, setSelectedFieldOfficer] = useState<string | undefined>(request.fieldOfficer?.id);
  const [selectedProgramManager, setSelectedProgramManager] = useState<string | undefined>(request.programManager?.id);
  const [loading, setLoading] = useState(false);
  
  // Can current user assign staff?
  const canAssign = userProfile && (
    userProfile.role === 'director' ||
    userProfile.role === 'head_of_programs' ||
    userProfile.role === 'patron' ||
    userProfile.role === 'ceo'
  );
  
  // Fetch available staff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        // Get field officers
        const { data: fieldOfficerData, error: fieldOfficerError } = await supabase
          .from('user_profiles')
          .select('id, name, email, role')
          .eq('role', 'field_officer')
          .order('name');
        
        if (fieldOfficerError) throw fieldOfficerError;
        
        // Get program managers
        const { data: programManagerData, error: programManagerError } = await supabase
          .from('user_profiles')
          .select('id, name, email, role')
          .eq('role', 'programme_manager')
          .order('name');
        
        if (programManagerError) throw programManagerError;
        
        setFieldOfficers(fieldOfficerData);
        setProgramManagers(programManagerData);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };
    
    if (canAssign) {
      fetchStaff();
    }
  }, [canAssign]);
  
  // Handle assignment
  const handleAssign = async () => {
    try {
      setLoading(true);
      
      // Update request with assigned staff
      const { error } = await supabase
        .from('requests')
        .update({
          field_officer_id: selectedFieldOfficer || null,
          program_manager_id: selectedProgramManager || null
        })
        .eq('id', request.id);
      
      if (error) throw error;
      
      toast({
        title: "Assignment updated",
        description: "The request assignment has been updated successfully."
      });
      
      onAssignmentChange();
    } catch (error) {
      console.error("Error assigning staff:", error);
      toast({
        title: "Assignment failed",
        description: "Failed to update staff assignments.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Assignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Field Officer Assignment */}
        <div>
          <p className="text-sm font-medium mb-2">Field Officer</p>
          {request.fieldOfficer && !canAssign ? (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{request.fieldOfficer.name}</span>
            </div>
          ) : !canAssign ? (
            <div className="text-muted-foreground text-sm">No field officer assigned</div>
          ) : (
            <Select 
              value={selectedFieldOfficer} 
              onValueChange={setSelectedFieldOfficer}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field officer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {fieldOfficers.map(officer => (
                  <SelectItem key={officer.id} value={officer.id}>
                    {officer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Program Manager Assignment */}
        <div>
          <p className="text-sm font-medium mb-2">Program Manager</p>
          {request.programManager && !canAssign ? (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{request.programManager.name}</span>
            </div>
          ) : !canAssign ? (
            <div className="text-muted-foreground text-sm">No program manager assigned</div>
          ) : (
            <Select 
              value={selectedProgramManager} 
              onValueChange={setSelectedProgramManager}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select program manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {programManagers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        {canAssign && (
          <Button 
            className="w-full" 
            onClick={handleAssign}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Assignment
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestAssignmentPanel;
