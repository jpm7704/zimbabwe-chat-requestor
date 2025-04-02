
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  roleKey: z.string().min(2, {
    message: "Role key must be at least 2 characters.",
  }),
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  hierarchyLevel: z.string().min(1, {
    message: "Please enter a hierarchy level.",
  }),
  canApprove: z.boolean().default(false),
  canAssign: z.boolean().default(false),
  canCreateReports: z.boolean().default(false),
  canManageUsers: z.boolean().default(false),
  canViewAnalytics: z.boolean().default(false),
  canManageSettings: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface RoleManagementFormProps {
  initialData?: {
    id?: string;
    roleKey?: string;
    displayName?: string;
    description?: string;
    hierarchyLevel?: number;
    canApprove?: boolean;
    canAssign?: boolean;
    canCreateReports?: boolean;
    canManageUsers?: boolean;
    canViewAnalytics?: boolean;
    canManageSettings?: boolean;
  };
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
}

export function RoleManagementForm({ 
  initialData = {}, 
  onSuccess, 
  mode = 'create' 
}: RoleManagementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleKey: initialData.roleKey || "",
      displayName: initialData.displayName || "",
      description: initialData.description || "",
      hierarchyLevel: initialData.hierarchyLevel?.toString() || "0",
      canApprove: initialData.canApprove || false,
      canAssign: initialData.canAssign || false,
      canCreateReports: initialData.canCreateReports || false,
      canManageUsers: initialData.canManageUsers || false,
      canViewAnalytics: initialData.canViewAnalytics || false,
      canManageSettings: initialData.canManageSettings || false,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      // In a real app, this would create or update the role in the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: mode === 'create' ? "Role created" : "Role updated",
        description: mode === 'create' 
          ? "The role has been successfully created." 
          : "The role has been successfully updated.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (mode === 'create') {
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${mode === 'create' ? 'create' : 'update'} role. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="roleKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Key</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. project_officer" 
                    {...field} 
                    disabled={mode === 'edit'}
                  />
                </FormControl>
                <FormDescription>
                  Internal identifier for the role (no spaces, use underscores)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Project Officer" {...field} />
                </FormControl>
                <FormDescription>
                  Name shown to users in the interface
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a description of this role and its responsibilities" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hierarchyLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hierarchy Level</FormLabel>
              <FormControl>
                <Input type="number" min="0" max="100" {...field} />
              </FormControl>
              <FormDescription>
                Determines the role's position in the organizational hierarchy (higher numbers have more authority)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Permissions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="canApprove"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Can Approve Requests</FormLabel>
                    <FormDescription>
                      Can approve or reject user requests
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="canAssign"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Can Assign Work</FormLabel>
                    <FormDescription>
                      Can assign requests to staff members
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="canCreateReports"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Can Create Reports</FormLabel>
                    <FormDescription>
                      Can create and manage reports
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="canManageUsers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Can Manage Users</FormLabel>
                    <FormDescription>
                      Can create and edit user accounts
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="canViewAnalytics"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Can View Analytics</FormLabel>
                    <FormDescription>
                      Can access analytics and reports
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="canManageSettings"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Can Manage Settings</FormLabel>
                    <FormDescription>
                      Can modify system settings
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          {mode === 'edit' && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess && onSuccess()}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting 
              ? (mode === 'create' ? "Creating..." : "Updating...") 
              : (mode === 'create' ? "Create Role" : "Update Role")
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default RoleManagementForm;
