
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { RequestStatus } from "@/types";

interface RequestsSearchFilterProps {
  onSearch: (term: string) => void;
  onFilter: (filter: string) => void;
  onSort: (sortField: string, direction: "asc" | "desc") => void;
  activeFilter: string;
}

const RequestsSearchFilter = ({ onSearch, onFilter, onSort, activeFilter }: RequestsSearchFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by ticket number or description"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button 
          onClick={handleSearch} 
          variant="outline"
          className="md:w-auto"
        >
          Search
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onFilter("all")}>
              All Requests
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilter("submitted")}>
              Submitted
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilter("assigned")}>
              Assigned
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilter("under_review")}>
              Under Review
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilter("manager_review")}>
              Manager Review
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilter("completed")}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilter("rejected")}>
              Rejected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="md:w-auto">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <span>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSort("createdAt", "desc")}>
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("createdAt", "asc")}>
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("status", "asc")}>
              Status (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("title", "asc")}>
              Title (A-Z)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="all" value={activeFilter} onValueChange={onFilter}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default RequestsSearchFilter;
