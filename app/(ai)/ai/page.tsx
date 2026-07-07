import JobAssistantChat from "@/components/ai/JobAssistantChat";

export const metadata = {
  title: "Empreso AI",
  description: "Chat with AI, Search jobs, ask about companies, and get career advice.",
};

export default function AssistantPage() {
  return <JobAssistantChat />;
}