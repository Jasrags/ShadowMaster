"use client";

import { useState } from "react";
import { Input } from "react-aria-components";

export function CampaignSearchFilter() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-input-border bg-input px-3 py-2 text-fg placeholder:text-muted-fg focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
        />
      </div>
      <div className="flex gap-2">
        <select
          className="rounded-lg border border-input-border bg-input px-3 py-2 text-fg focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
          defaultValue="all"
        >
          <option value="all">All Campaigns</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
}

