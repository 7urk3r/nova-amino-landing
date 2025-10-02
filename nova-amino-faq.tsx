import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQAccordion = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const faqSections = [
          {
      id: 'general',
      title: 'General Questions',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      questions: [
        {
          q: "What exactly are peptides?",
          a: "Peptides are short chains of amino acids—like fragments of proteins—that play a role in nearly every biological function. In the body, peptides act as messenger molecules, signaling cells to carry out specific tasks like tissue repair, metabolic regulation, inflammation response, and hormone release. In research, synthetic peptides are used to study these biological signaling pathways in a controlled environment."
        },
        {
          q: "Are Nova Amino peptides natural or synthetic?",
          a: "All peptides we offer are synthetically produced using solid-phase peptide synthesis (SPPS). This method allows for tight control over sequence, purity, and reproducibility. No biological sourcing, no animal-derived material—just clean, research-grade molecules."
        },
        {
          q: "What form do peptides arrive in?",
          a: "Every peptide is supplied as a lyophilized (freeze-dried) powder, packaged in a sealed glass vial with a rubber stopper and aluminum crimp cap. This form ensures long-term stability and allows the compound to be reconstituted as needed."
        },
        {
          q: "Why are they freeze-dried?",
          a: "Lyophilization removes moisture without heat, preserving the integrity of the compound and extending its shelf life. It also reduces the risk of microbial contamination during storage and transport."
        }
      ]
    },
    {
      id: 'storage',
      title: 'Storage & Handling',
      color: 'bg-green-50 border-green-200 text-green-700',
      questions: [
        {
          q: "Do I need to refrigerate peptides when they arrive?",
          a: "Lyophilized peptides are stable at room temperature during shipping. Once received, store them in a freezer at −20°C or below for long-term use. After reconstitution, keep the solution refrigerated (2−8°C) and avoid freeze-thaw cycles by aliquoting into single-use portions."
        },
        {
          q: "What is reconstitution?",
          a: "Reconstitution is the process of dissolving freeze-dried peptide powder into a sterile liquid (e.g., bacteriostatic water) to create a usable stock solution for lab protocols. The appropriate solvent depends on the peptide's sequence and solubility profile."
        },
        {
          q: "Can you help me with dosing or reconstitution instructions?",
          a: "No. Nova Amino does not provide guidance for preparation, administration, or biological use. All products are intended strictly for in vitro research. We do not support or condone any off-label or non-research applications."
        }
      ]
    },
    {
      id: 'quality',
      title: 'Quality & Testing',
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      questions: [
        {
          q: "Are your peptides tested?",
          a: "Yes. Every batch is tested by the manufacturer using validated analytical techniques, including high-performance liquid chromatography (HPLC) and mass spectrometry (MS), to confirm both identity and purity. While we do not publish Certificates of Analysis (COAs) at launch, all products meet strict internal specifications for research-grade quality. COAs will be made available on product pages in a future update."
        },
        {
          q: "What does \"purity\" mean?",
          a: "Purity refers to the percentage of the compound that matches the intended peptide sequence. A peptide marked \">99% pure\" contains minimal synthesis-related byproducts and is suitable for most laboratory research protocols."
        }
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping & Ordering',
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      questions: [
        {
          q: "Where do you ship from?",
          a: "All orders are processed and shipped from within the United States."
        },
        {
          q: "How quickly will my order ship?",
          a: "Orders placed before 12:00 PM Pacific Time typically ship the same day. Orders placed after that cutoff will ship the following business day. Once shipped, you'll receive a tracking email with delivery updates."
        },
        {
          q: "Do you offer shipping protection?",
          a: "Yes. Optional shipping insurance is available at checkout. This covers loss, damage, or theft during transit. We highly recommend it."
        },
        {
          q: "Can I return or exchange a product?",
          a: "Due to the sensitive nature of research compounds, all sales are final. However, if you receive the wrong item or your order is damaged during transit, contact us within 48 hours and we'll resolve it promptly."
        },
        {
          q: "Can I change my shipping address after ordering?",
          a: "If your order hasn't shipped yet, reach out to our support team immediately. Once an order has left our facility, we can no longer modify the destination address."
        }
      ]
    },
    {
      id: 'legal',
      title: 'Legal & Compliance',
      color: 'bg-red-50 border-red-200 text-red-700',
      questions: [
        {
          q: "Are Nova Amino products for human or veterinary use?",
          a: "No. Our products are sold strictly for laboratory research use only (RUO) and are not intended for use in humans or animals. They are not classified as drugs, dietary supplements, or medical devices, and they are not reviewed or approved by the FDA for any therapeutic or diagnostic purpose. While many peptides under investigation show promise in areas like cellular repair, metabolism, and immune modulation, we are legally restricted from making any claims regarding their effects or applications outside of a research setting. As such, we provide no guidance for personal use, and all compounds are labeled and distributed in accordance with RUO compliance standards."
        },
        {
          q: "Can I ask questions about dosage or effects?",
          a: "No. We cannot respond to any inquiries related to dosing, preparation, clinical use, or biological effects. Any such request will be ignored."
        },
        {
          q: "What does \"Research Use Only\" mean?",
          a: "It means our products may only be used for in vitro studies in a controlled lab environment by qualified individuals. Use in humans or animals is explicitly prohibited and may violate federal law."
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="space-y-4">
        {faqSections.map((section) => (
          <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 ${openSections[section.id] ? section.color : ''}`}
            >
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              <div className="text-gray-500">
                {openSections[section.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>
            
            <div className={`transition-all duration-300 ease-in-out ${openSections[section.id] ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="px-6 pb-6">
                <div className="space-y-6">
                  {section.questions.map((item, index) => (
                    <div key={index} className="border-l-4 border-gray-200 pl-4">
                      <h4 className="font-medium text-gray-900 mb-2">{item.q}</h4>
                      <p className="text-gray-700 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Need help? We'd love to hear from you! Reach out at <a href="mailto:support@novaamino.com" className="text-blue-600 hover:text-blue-800 font-medium">support@novaamino.com</a>
        </p>
      </div>
    </div>
  );
};

export default FAQAccordion;