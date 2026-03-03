import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How many free quizzes can I generate?",
    answer:
      "Free users get 5 quiz generations per account. Each generation creates a complete quiz with multiple questions based on your topic and difficulty selection.",
  },
  {
    question: "What happens after I use all my free credits?",
    answer:
      "Once you've used your 5 free credits, you can upgrade to Pro for unlimited quiz generation, or wait for our monthly credit refresh (coming soon).",
  },
  {
    question: "Can I edit quizzes after generating them?",
    answer:
      "Yes! You can review and modify any generated quiz before sharing it.",
  },
  {
    question: "Is my data safe and private?",
    answer:
      "We use enterprise-grade encryption and never share your data with third parties.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your Pro subscription at any time and keep access until the end of the billing period.",
  },
];

export default function FAQ() {
  return (
    <div className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto bg-white">
      <div className="absolute inset-0 -z-10 bg-white" />

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
          Frequently asked questions
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about Think Stack before you dive in.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, idx) => (
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
            className="bg-card/90 border border-border rounded-2xl px-4 sm:px-6 shadow-sm hover:border-blue-500/60 transition-colors"
          >
            <AccordionTrigger className="text-left hover:no-underline py-5">
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-medium text-foreground"
              >
                {faq.question}
              </motion.span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-5">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
