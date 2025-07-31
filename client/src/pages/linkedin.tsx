import { Linkedin } from "lucide-react";
import LinkedInGenerator from "@/components/content/linkedin-generator";

export default function LinkedInPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="w-24 h-24 gradient-bg rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Linkedin className="text-4xl text-white" size={48} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            LinkedIn Content <span className="gradient-text">Generator</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create professional LinkedIn posts that engage your network and establish thought leadership in your industry.
          </p>
        </div>
      </section>

      {/* Content Generation Tool */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <LinkedInGenerator />
        </div>
      </section>
    </div>
  );
}
