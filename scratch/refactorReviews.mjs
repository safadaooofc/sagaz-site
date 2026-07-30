import fs from 'fs';

let pageContent = fs.readFileSync('./src/app/(dashboard)/reviews/page.tsx', 'utf8');

// Replace imports and definition
pageContent = pageContent.replace("export default function ReviewsPage() {", "import { createStoreReview } from './actions';\nimport { toast } from 'sonner';\nimport { useRouter } from 'next/navigation';\n\nexport default function ReviewsClient({ serverReviews }: { serverReviews: Review[] }) {");

// Remove the hardcoded initialReviews array
pageContent = pageContent.replace(/const initialReviews: Review\[\] = \[[\s\S]*?\];/m, "");

// Replace state initialization
pageContent = pageContent.replace("useState<Review[]>(initialReviews)", "useState<Review[]>(serverReviews)");

// Add submit logic
const submitLogic = `
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!title || !content) return toast.error("Preencha título e comentário.");
    setIsSubmitting(true);
    const res = await createStoreReview(newReviewStars, title, content);
    setIsSubmitting(false);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Avaliação enviada!");
      setIsModalOpen(false);
      router.refresh(); // Refresh page to get new reviews
    }
  };
`;
pageContent = pageContent.replace("const [newReviewStars, setNewReviewStars] = useState(5);", "const [newReviewStars, setNewReviewStars] = useState(5);\n" + submitLogic);

// Replace input values
pageContent = pageContent.replace(/<input type="text" placeholder="Resuma/g, '<input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Resuma');
pageContent = pageContent.replace(/<textarea rows=\{4\} placeholder="Conte-nos/g, '<textarea rows={4} value={content} onChange={e => setContent(e.target.value)} placeholder="Conte-nos');

// Replace submit button
pageContent = pageContent.replace(/<button onClick=\{\(\) => setIsModalOpen\(false\)\} className="px-5 py-2\.5 rounded-lg text-\[13px\] font-bold text-\[#0f1115\] bg-\[#eab308\][^"]*"[\s\S]*?Enviar Avaliação[\s\S]*?<\/button>/m, `<button onClick={handleSubmit} disabled={isSubmitting} className="px-5 py-2.5 rounded-lg text-[13px] font-bold text-[#0f1115] bg-[#eab308] hover:bg-[#ca8a04] transition-colors">{isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}</button>`);

// Fix type Review id from number to string | number
pageContent = pageContent.replace(/id: number;/g, "id: string | number;");
pageContent = pageContent.replace(/toggleHelpful = \(id: number\)/g, "toggleHelpful = (id: string | number)");

fs.writeFileSync('./src/app/(dashboard)/reviews/ReviewsClient.tsx', pageContent);
