import { FaqContent } from "@/components/FaqContent";

export default function PublicFaqPage() {
  return (
    <div className="min-h-screen bg-[#0f1115] px-4 md:px-8">
      <FaqContent isPublic={true} />
    </div>
  );
}
