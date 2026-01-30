
import Dashboard from "./Pages/Dashboard";
import { Section } from "@/components/ui/section";
import { useGetAllUsers } from "../../../query/queries/adminQueries";
function AdminPanel() {
  const { data: users } = useGetAllUsers();
  console.log("users", users);
  return (
    <Section className="flex flex-col px-8 py-6">
      <Dashboard />
    </Section>
  );
}

export default AdminPanel;
