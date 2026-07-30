import { FaqContent } from "@/components/FaqContent";

export default function PrivateFaqPage() {
  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <FaqContent isPublic={false} />
    </div>
  );
}
