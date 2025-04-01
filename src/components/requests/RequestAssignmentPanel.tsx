
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Request } from '@/types';
import { Loader2 } from 'lucide-react';
import { UserCircle } from 'lucide-react';
import { updateRequest } from '@/services/api/requestMutationApi';

interface RequestAssignmentPanelProps {
  request: Request;
  onAssignmentChange: () => void;
}

type StaffMember = {
  id: string;
  name: string;
  role: string;
  email: string;
};

const RequestAssignmentPanel = ({ request, onAssignmentChange }: RequestAssignmentPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [fieldOfficers, setFieldOfficers] = useState<StaffMember[]>([]);
  const [programManagers, setProgramManagers] = useState<StaffMember[]>([]);
  const [selectedFieldOfficer, setSelectedFieldOfficer] = useState<string | undefined>(
    request.fieldOfficer ? request.fieldOfficer.id : undefined
  );
  const [selectedProgramManager, setSelectedProgramManager] = useState<string | undefined>(
    request.programManager ? request.programManager.id : undefined
  );
  const { toast } = useToast();
  
  // Load staff members on initial render
  useEffect(() => {
    const loadStaffMembers = async () => {
      try {
        setLoading(true);
        
        // Fetch field officers
        const { data: officers, error: officersError } = await supabase
          .from('user_profiles')
          .select('id, name, email, role')
          .eq('role', 'field_officer');
          
        if (officersError) throw officersError;
        setFieldOfficers(officers || []);
        
        // Fetch program managers
        const { data: managers, error: managersError } = await supabase
          .from('user_profiles')
          .select('id, name, email, role')
          .eq('role', 'programme_manager');
          
        if (managersError) throw managersError;
        setProgramManagers(managers || []);
        
      } catch (error) {
        console.error('Error loading staff members:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStaffMembers();
  }, []);
  
  const handleAssignFieldOfficer = async () => {
    if (!selectedFieldOfficer) return;
    
    try {
      setLoading(true);
      
      // Update request with new field officer
      await updateRequest(request.id, {
        field_officer_id: selectedFieldOfficer
      });
      
      toast({
        title: "Field Officer Assigned",
        description: "Field officer has been assigned to this request."
      });
      
      // Trigger refresh of parent component
      onAssignmentChange();
      
    } catch (error) {
      console.error('Error assigning field officer:', error);
      toast({
        title: "Assignment Failed",
        description: "Failed to assign field officer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAssignProgramManager = async () => {
    if (!selectedProgramManager) return;
    
    try {
      setLoading(true);
      
      // Update request with new program manager
      await updateRequest(request.id, {
        program_manager_id: selectedProgramManager
      });
      
      toast({
        title: "Program Manager Assigned",
        description: "Program manager has been assigned to this request."
      });
      
      // Trigger refresh of parent component
      onAssignmentChange();
      
    } catch (error) {
      console.error('Error assigning program manager:', error);
      toast({
        title: "Assignment Failed",
        description: "Failed to assign program manager. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Field Officer Section */}
        <div className="space-y-2">
          <h3 className="font-medium">Field Officer</h3>
          {request.fieldOfficer ? (
            <div className="flex items-center p-3 bg-secondary/20 rounded-md">
              <UserCircle className="h-5 w-5 mr-2 text-primary" />
              <div>
                <p className="font-medium text-sm">{request.fieldOfficer.name}</p>
                <p className="text-xs text-muted-foreground">{request.fieldOfficer.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No field officer assigned</p>
          )}
          
          <div className="flex gap-2 pt-2">
            <Select value={selectedFieldOfficer} onValueChange={setSelectedFieldOfficer}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select field officer" />
              </SelectTrigger>
              <SelectContent>
                {fieldOfficers.map(officer => (
                  <SelectItem key={officer.id} value={officer.id}>
                    {officer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleAssignFieldOfficer} 
              disabled={!selectedFieldOfficer || loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assign'}
            </Button>
          </div>
        </div>
        
        {/* Program Manager Section */}
        <div className="space-y-2 pt-4">
          <h3 className="font-medium">Program Manager</h3>
          {request.programManager ? (
            <div className="flex items-center p-3 bg-secondary/20 rounded-md">
              <UserCircle className="h-5 w-5 mr-2 text-primary" />
              <div>
                <p className="font-medium text-sm">{request.programManager.name}</p>
                <p className="text-xs text-muted-foreground">{request.programManager.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No program manager assigned</p>
          )}
          
          <div className="flex gap-2 pt-2">
            <Select value={selectedProgramManager} onValueChange={setSelectedProgramManager}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select program manager" />
              </SelectTrigger>
              <SelectContent>
                {programManagers.map(manager => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleAssignProgramManager} 
              disabled={!selectedProgramManager || loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assign'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestAssignmentPanel;
