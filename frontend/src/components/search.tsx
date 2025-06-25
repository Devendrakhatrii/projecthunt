import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [value, setValue] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex flex-1 max-w-sm mx-8">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-10"
          value={value}
          onChange={handleInput}
        />
      </div>
    </div>
  );
}
