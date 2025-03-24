
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, ArrowUpDown } from "lucide-react";

interface RequestsSearchFilterProps {
  onSearch: (term: string) => void;
  onFilter: (filter: string) => void;
  activeFilter: string;
}

const RequestsSearchFilter = ({ onSearch, onFilter, activeFilter }: RequestsSearchFilterProps) => {
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
        <Button variant="outline" className="md:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          <span>Filter</span>
        </Button>
        <Button variant="outline" className="md:w-auto">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          <span>Sort</span>
        </Button>
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
