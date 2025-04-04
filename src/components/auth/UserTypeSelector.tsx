
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle2, ShieldCheck } from "lucide-react";

interface UserTypeSelectorProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const UserTypeSelector = ({ activeTab, setActiveTab }: UserTypeSelectorProps) => {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full mb-4"
    >
      <TabsList className="grid grid-cols-2 w-full">
        <TabsTrigger value="user" className="flex items-center gap-2">
          <UserCircle2 className="h-4 w-4" />
          <span>Regular User</span>
        </TabsTrigger>
        <TabsTrigger value="staff" className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span>Staff Access</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="user" className="mt-2">
        <div className="text-sm text-muted-foreground">
          Create a regular user account to submit assistance requests.
        </div>
      </TabsContent>
      
      <TabsContent value="staff" className="mt-2">
        <div className="text-sm text-muted-foreground">
          Create a staff account with role-specific access to the system.
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default UserTypeSelector;
