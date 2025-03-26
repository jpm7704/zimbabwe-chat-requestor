
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users } from "lucide-react";

interface UserTypeSelectorProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const UserTypeSelector = ({ activeTab, setActiveTab }: UserTypeSelectorProps) => {
  return (
    <Tabs 
      defaultValue="user" 
      value={activeTab} 
      onValueChange={setActiveTab} 
      className="mb-6"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="user" className="flex items-center gap-2">
          <User size={16} />
          <span>Regular User</span>
        </TabsTrigger>
        <TabsTrigger value="admin" className="flex items-center gap-2">
          <Users size={16} />
          <span>Staff Access</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default UserTypeSelector;
