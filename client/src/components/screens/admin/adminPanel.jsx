import React from "react";
import Dashboard from "./Pages/Dashboard";
import { Section } from "@/components/ui/section";

function AdminPanel() {
  return (
    <Section className="flex flex-col px-8 py-6">
      <Dashboard />
    </Section>
  );
}

export default AdminPanel;
