// 'use client';

// import { useState, useRef } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import {
//   ArrowUp,
//   ArrowDown,
//   Plus,
//   Minus,
//   Save,
//   Download,
//   Building2,
//   FileText,
//   Package,
//   DollarSign,
//   FileCheck,
//   Handshake,
//   Eye,
//   EyeOff,
//   GripVertical,
//   Image as ImageIcon,
//   Trash2
// } from 'lucide-react';
// import { useCurrencyStore } from '@/stores/currency';
// import mockData from '@/lib/mock-data';
// import { Customer, Product } from '@/types';

// interface QuotationSection {
//   id: string;
//   type: 'cover_page' | 'executive_summary' | 'company_introduction' | 'problem_statement' | 'solution_details' | 'product_specifications' | 'quotation_items' | 'timeline_schedule' | 'terms_warranties' | 'contact_information';
//   title: string;
//   enabled: boolean;
//   order: number;
//   data: any;
// }

// interface ProductDetail {
//   id: string;
//   productId: string;
//   quantity: number;
//   unitPrice: number;
//   discount: number;
//   description: string;
//   images: string[];
// }

// interface QuotationItem {
//   id: string;
//   itemId: string;
//   productId: string;
//   productName: string;
//   description: string;
//   quantity: number;
//   rate: number;
//   discount: number;
//   discountType: 'percentage' | 'fixed';
//   tax: number;
//   taxType: 'percentage' | 'fixed';
//   serviceCharges: number;
//   amount: number;
// }

// export default function NewSalesQuotationPage() {
//   const { formatAmount } = useCurrencyStore();
//   const [sections, setSections] = useState<QuotationSection[]>([
//     {
//       id: 'cover_page',
//       type: 'cover_page',
//       title: 'Cover Page & Letter',
//       enabled: true,
//       order: 1,
//       data: {
//         companyLogo: mockData.companySettings.logoUrl,
//         companyName: mockData.companySettings.companyName,
//         companyAddress: `${mockData.companySettings.address.street}, ${mockData.companySettings.address.city}, ${mockData.companySettings.address.state} ${mockData.companySettings.address.zipCode}, ${mockData.companySettings.address.country}`,
//         companyPhone: mockData.companySettings.contact.phone,
//         companyEmail: mockData.companySettings.contact.email,
//         companyWebsite: mockData.companySettings.contact.website,
//         date: new Date().toISOString().split('T')[0],
//         recipientName: '',
//         recipientCompany: '',
//         recipientAddress: '',
//         recipientPhone: '',
//         recipientEmail: '',
//         subject: 'Proposal for Professional Services',
//         salutation: 'Dear [Recipient Name],',
//         letterContent: `We are pleased to submit this comprehensive proposal for your consideration. Our team has carefully analyzed your requirements and developed a tailored solution that meets your specific needs.

// This proposal outlines our understanding of your project requirements, our proposed solution, detailed specifications, pricing structure, and implementation timeline.

// We look forward to the opportunity to work with you and deliver exceptional results.`,
//         senderName: 'Sales Representative',
//         senderTitle: 'Sales Executive',
//         senderPhone: '+971 50 123 4567',
//         senderEmail: 'sales@sbrtech.com'
//       }
//     },
//     {
//       id: 'executive_summary',
//       type: 'executive_summary',
//       title: 'Executive Summary',
//       enabled: true,
//       order: 2,
//       data: {
//         summary: `This proposal presents a comprehensive solution tailored to meet your specific business requirements. Our experienced team brings deep industry knowledge and proven methodologies to deliver exceptional results.

// Key highlights of our proposal include:
// • Customized solution addressing your unique challenges
// • Competitive pricing with flexible payment terms
// • Proven track record of successful project delivery
// • Comprehensive support and maintenance services
// • Commitment to quality and customer satisfaction

// We are confident that our solution will exceed your expectations and deliver significant value to your organization.`,
//         keyBenefits: [
//           'Cost-effective solution with ROI within 6 months',
//           'Streamlined processes reducing operational overhead by 30%',
//           'Scalable architecture supporting future growth',
//           '24/7 technical support and maintenance',
//           'Comprehensive training and knowledge transfer'
//         ],
//         proposalValue: '',
//         estimatedDuration: '3-6 months',
//         totalInvestment: ''
//       }
//     },
//     {
//       id: 'quotation_items',
//       type: 'quotation_items',
//       title: 'Quotation Items',
//       enabled: true,
//       order: 3,
//       data: {
//         items: [] as QuotationItem[],
//         subtotal: 0,
//         totalDiscount: 0,
//         totalTax: 0,
//         serviceCharges: 0,
//         grandTotal: 0,
//         currency: 'AED',
//         notes: ''
//       }
//     },
//     {
//       id: 'timeline_schedule',
//       type: 'timeline_schedule',
//       title: 'Timeline & Delivery Schedule',
//       enabled: true,
//       order: 4,
//       data: {
//         totalDuration: '16 weeks',
//         startDate: '',
//         endDate: '',
//         phases: [
//           {
//             name: 'Planning & Analysis',
//             duration: '2 weeks',
//             startDate: '',
//             endDate: '',
//             deliverables: [
//               'Requirements gathering',
//               'System analysis',
//               'Project plan development',
//               'Resource allocation'
//             ],
//             milestones: ['Kickoff meeting', 'Requirements signoff']
//           },
//           {
//             name: 'Design & Development',
//             duration: '8 weeks',
//             startDate: '',
//             endDate: '',
//             deliverables: [
//               'System design documents',
//               'UI/UX mockups',
//               'Database design',
//               'Core functionality development',
//               'Integration development'
//             ],
//             milestones: ['Design approval', 'Development completion', 'Testing phase start']
//           },
//           {
//             name: 'Testing & Quality Assurance',
//             duration: '3 weeks',
//             startDate: '',
//             endDate: '',
//             deliverables: [
//               'Unit testing',
//               'Integration testing',
//               'User acceptance testing',
//               'Performance testing',
//               'Security testing'
//             ],
//             milestones: ['QA completion', 'UAT signoff']
//           },
//           {
//             name: 'Deployment & Training',
//             duration: '3 weeks',
//             startDate: '',
//             endDate: '',
//             deliverables: [
//               'Production deployment',
//               'Data migration',
//               'User training sessions',
//               'Documentation delivery',
//               'Go-live support'
//             ],
//             milestones: ['Go-live', 'Training completion', 'Project closure']
//           }
//         ],
//         criticalPath: [
//           'Requirements analysis completion',
//           'Design approval',
//           'Development milestone reviews',
//           'Testing completion',
//           'User acceptance signoff'
//         ],
//         dependencies: [
//           'Phase 2 cannot start until Phase 1 requirements are approved',
//           'Phase 3 testing requires Phase 2 development completion',
//           'Phase 4 deployment requires Phase 3 testing signoff'
//         ],
//         risks: [
//           {
//             risk: 'Resource availability',
//             impact: 'Medium',
//             mitigation: 'Backup resource planning and cross-training'
//           },
//           {
//             risk: 'Third-party integration delays',
//             impact: 'High',
//             mitigation: 'Early vendor engagement and contingency planning'
//           },
//           {
//             risk: 'Scope changes',
//             impact: 'Medium',
//             mitigation: 'Change control process and regular scope reviews'
//           }
//         ]
//       }
//     },
//     {
//       id: 'terms_warranties',
//       type: 'terms_warranties',
//       title: 'Terms & Warranties',
//       enabled: true,
//       order: 5,
//       data: {
//         generalTerms: `1. **Acceptance**: This proposal constitutes the entire agreement between the parties.
// 2. **Validity**: This proposal is valid for 30 days from the date of submission.
// 3. **Payment Terms**: All payments must be made according to the agreed schedule.
// 4. **Intellectual Property**: All deliverables remain the property of the client upon full payment.
// 5. **Confidentiality**: Both parties agree to maintain confidentiality of proprietary information.`,
//         warranties: [
//           {
//             item: 'Software Functionality',
//             warranty: '12 months from go-live date',
//             coverage: 'Bugs and defects in core functionality',
//             exclusions: 'Custom modifications, third-party integrations'
//           },
//           {
//             item: 'System Performance',
//             warranty: '99.5% uptime SLA',
//             coverage: 'System availability and performance',
//             exclusions: 'Scheduled maintenance, force majeure events'
//           },
//           {
//             item: 'Data Security',
//             warranty: 'Industry-standard security measures',
//             coverage: 'Data protection and privacy compliance',
//             exclusions: 'Client data breaches due to misuse'
//           }
//         ],
//         limitations: `• Warranty does not cover damages due to misuse or unauthorized modifications
// • Warranty is limited to the original specifications and scope
// • Third-party components are covered by their respective vendor warranties
// • Warranty claims must be reported within 30 days of discovery`,
//         supportServices: {
//           included: [
//             '24/7 system monitoring',
//             'Email support during business hours',
//             'Phone support for critical issues',
//             'Regular system updates and patches',
//             'Knowledge base and documentation access'
//           ],
//           optional: [
//             'Dedicated support engineer',
//             'On-site support visits',
//             'Extended warranty coverage',
//             'Custom training sessions',
//             'Emergency response service'
//           ]
//         },
//         terminationClauses: `Either party may terminate this agreement with 30 days written notice. In case of termination:
// • Client will pay for all services rendered up to termination date
// • All intellectual property rights transfer to client
// • Confidential information remains protected
// • Outstanding payments become immediately due`,
//         governingLaw: 'United Arab Emirates',
//         disputeResolution: 'Arbitration in Dubai International Arbitration Centre'
//       }
//     },
//     {
//       id: 'contact_information',
//       type: 'contact_information',
//       title: 'Contact Information & Signatures',
//       enabled: true,
//       order: 6,
//       data: {
//         companyContacts: [
//           {
//             name: 'Sales Representative',
//             title: 'Sales Executive',
//             phone: '+971 50 123 4567',
//             email: 'sales@sbrtech.com',
//             department: 'Sales'
//           },
//           {
//             name: 'Technical Support',
//             title: 'Support Specialist',
//             phone: '+971 50 765 4321',
//             email: 'support@sbrtech.com',
//             department: 'Technical'
//           }
//         ],
//         clientContacts: [
//           {
//             name: '',
//             title: '',
//             phone: '',
//             email: '',
//             department: ''
//           }
//         ],
//         signatures: {
//           clientSignature: '',
//           clientName: '',
//           clientTitle: '',
//           clientDate: '',
//           companySignature: 'Sales Representative',
//           companyTitle: 'Sales Executive',
//           companyDate: new Date().toISOString().split('T')[0]
//         },
//         nextSteps: [
//           'Review and approval of proposal',
//           'Contract signing and legal review',
//           'Project kickoff meeting scheduling',
//           'Resource allocation and team assignment',
//           'Detailed project planning and timeline confirmation'
//         ],
//         additionalNotes: ''
//       }
//     }
//   ]);

//   const [draggedSection, setDraggedSection] = useState<string | null>(null);
//   const dragOverRef = useRef<HTMLDivElement>(null);

//   const customers = mockData.customers;
//   const products = mockData.products;

//   const moveSection = (fromIndex: number, toIndex: number) => {
//     const newSections = [...sections];
//     const [moved] = newSections.splice(fromIndex, 1);
//     newSections.splice(toIndex, 0, moved);

//     // Update order numbers
//     newSections.forEach((section, index) => {
//       section.order = index + 1;
//     });

//     setSections(newSections);
//   };

//   const toggleSection = (sectionId: string) => {
//     setSections(sections.map(section =>
//       section.id === sectionId
//         ? { ...section, enabled: !section.enabled }
//         : section
//     ));
//   };

//   const updateSectionData = (sectionId: string, data: any) => {
//     setSections(sections.map(section =>
//       section.id === sectionId
//         ? { ...section, data: { ...section.data, ...data } }
//         : section
//     ));
//   };

//   const addQuotationItem = () => {
//     const quotationSection = sections.find(s => s.type === 'quotation_items');
//     if (quotationSection) {
//       const newItem: QuotationItem = {
//         id: `item_${Date.now()}`,
//         itemId: `Q${(quotationSection.data.items.length + 1).toString().padStart(3, '0')}`,
//         productId: '',
//         productName: '',
//         description: '',
//         quantity: 1,
//         rate: 0,
//         discount: 0,
//         discountType: 'percentage',
//         tax: 0,
//         taxType: 'percentage',
//         serviceCharges: 0,
//         amount: 0
//       };

//       updateSectionData('quotation_items', {
//         items: [...quotationSection.data.items, newItem]
//       });
//     }
//   };

//   const removeQuotationItem = (itemId: string) => {
//     const quotationSection = sections.find(s => s.type === 'quotation_items');
//     if (quotationSection) {
//       updateSectionData('quotation_items', {
//         items: quotationSection.data.items.filter((item: QuotationItem) => item.id !== itemId)
//       });
//       calculateTotals();
//     }
//   };

//   const updateQuotationItem = (itemId: string, data: Partial<QuotationItem>) => {
//     const quotationSection = sections.find(s => s.type === 'quotation_items');
//     if (quotationSection) {
//       const updatedItems = quotationSection.data.items.map((item: QuotationItem) => {
//         if (item.id === itemId) {
//           const updatedItem = { ...item, ...data };
//           // Calculate amount
//           const subtotal = updatedItem.quantity * updatedItem.rate;
//           const discountAmount = updatedItem.discountType === 'percentage'
//             ? subtotal * (updatedItem.discount / 100)
//             : updatedItem.discount;
//           const taxableAmount = subtotal - discountAmount;
//           const taxAmount = updatedItem.taxType === 'percentage'
//             ? taxableAmount * (updatedItem.tax / 100)
//             : updatedItem.tax;
//           updatedItem.amount = taxableAmount + taxAmount + updatedItem.serviceCharges;
//           return updatedItem;
//         }
//         return item;
//       });

//       updateSectionData('quotation_items', { items: updatedItems });
//     }
//   };

//   const calculateTotals = () => {
//     const quotationSection = sections.find(s => s.type === 'quotation_items');

//     if (!quotationSection) return;

//     let subtotal = 0;
//     let totalDiscount = 0;
//     let totalTax = 0;

//     quotationSection.data.items.forEach((item: QuotationItem) => {
//       const itemSubtotal = item.quantity * item.rate;
//       const itemDiscount = item.discountType === 'percentage'
//         ? itemSubtotal * (item.discount / 100)
//         : item.discount;
//       const itemTax = item.taxType === 'percentage'
//         ? (itemSubtotal - itemDiscount) * (item.tax / 100)
//         : item.tax;

//       subtotal += itemSubtotal;
//       totalDiscount += itemDiscount;
//       totalTax += itemTax;
//     });

//     const grandTotal = subtotal - totalDiscount + totalTax + quotationSection.data.serviceCharges;

//     updateSectionData('quotation_items', {
//       subtotal,
//       totalDiscount,
//       totalTax,
//       grandTotal
//     });
//   };

//   const handleDragStart = (e: React.DragEvent, sectionId: string) => {
//     setDraggedSection(sectionId);
//     e.dataTransfer.effectAllowed = 'move';
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = 'move';
//   };

//   const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
//     e.preventDefault();
//     if (!draggedSection || draggedSection === targetSectionId) return;

//     const fromIndex = sections.findIndex(s => s.id === draggedSection);
//     const toIndex = sections.findIndex(s => s.id === targetSectionId);

//     moveSection(fromIndex, toIndex);
//     setDraggedSection(null);
//   };

//   const generatePDF = () => {
//     const enabledSections = sections.filter(s => s.enabled);
//     // PDF generation logic would go here
//     console.log('Generating PDF with sections:', enabledSections);
//     alert('PDF generation feature would be implemented here');
//   };

//   const saveQuotation = () => {
//     // Save quotation logic would go here
//     alert('Quotation saved successfully!');
//   };

//   const renderSection = (section: QuotationSection) => {
//     switch (section.type) {
//       case 'executive_summary':
//         return (
//           <div className="space-y-6">
//             <div className="space-y-4">
//               <Label htmlFor="summary">Executive Summary</Label>
//               <Textarea
//                 id="summary"
//                 value={section.data.summary}
//                 onChange={(e) => updateSectionData(section.id, { summary: e.target.value })}
//                 rows={8}
//                 className="text-lg leading-relaxed"
//               />
//             </div>

//             <div className="space-y-4">
//               <Label>Key Benefits</Label>
//               <div className="space-y-2">
//                 {section.data.keyBenefits.map((benefit: string, index: number) => (
//                   <div key={index} className="flex items-center space-x-2">
//                     <span className="text-green-600 font-bold">•</span>
//                     <Input
//                       value={benefit}
//                       onChange={(e) => {
//                         const newBenefits = [...section.data.keyBenefits];
//                         newBenefits[index] = e.target.value;
//                         updateSectionData(section.id, { keyBenefits: newBenefits });
//                       }}
//                       className="flex-1"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="proposalValue">Proposal Value</Label>
//                 <Input
//                   id="proposalValue"
//                   value={section.data.proposalValue}
//                   onChange={(e) => updateSectionData(section.id, { proposalValue: e.target.value })}
//                   placeholder="e.g., $500,000"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="estimatedDuration">Estimated Duration</Label>
//                 <Input
//                   id="estimatedDuration"
//                   value={section.data.estimatedDuration}
//                   onChange={(e) => updateSectionData(section.id, { estimatedDuration: e.target.value })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="totalInvestment">Total Investment</Label>
//                 <Input
//                   id="totalInvestment"
//                   value={section.data.totalInvestment}
//                   onChange={(e) => updateSectionData(section.id, { totalInvestment: e.target.value })}
//                 />
//               </div>
//             </div>
//           </div>
//         );

//       case 'quotation_items':
//         return (
//           <div className="space-y-6">
//             {/* Quotation Items Table */}
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <h4 className="font-semibold text-lg">Quotation Items</h4>
//                 <Button onClick={addQuotationItem} size="sm">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Item
//                 </Button>
//               </div>

//               {/* Table Header */}
//               <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg font-medium text-sm">
//                 <div className="col-span-1">Item ID</div>
//                 <div className="col-span-2">Product</div>
//                 <div className="col-span-2">Description</div>
//                 <div className="col-span-1">Qty</div>
//                 <div className="col-span-1">Rate</div>
//                 <div className="col-span-1">Discount</div>
//                 <div className="col-span-1">Tax</div>
//                 <div className="col-span-1">Service</div>
//                 <div className="col-span-1">Amount</div>
//                 <div className="col-span-1">Actions</div>
//               </div>

//               {/* Items */}
//               {section.data.items.map((item: QuotationItem, index: number) => (
//                 <div key={item.id} className="grid grid-cols-12 gap-2 p-3 border rounded-lg">
//                   <div className="col-span-1">
//                     <Input
//                       value={item.itemId}
//                       onChange={(e) => updateQuotationItem(item.id, { itemId: e.target.value })}
//                       placeholder="001"
//                       className="text-sm"
//                     />
//                   </div>
//                   <div className="col-span-2 space-y-1">
//                     <Select
//                       value={item.productId}
//                       onValueChange={(value) => {
//                         const product = products.find(p => p.id === value);
//                         updateQuotationItem(item.id, {
//                           productId: value,
//                           productName: product?.name || '',
//                           description: product?.description || '',
//                           rate: product?.sellingPrice || 0
//                         });
//                       }}
//                     >
//                       <SelectTrigger className="text-sm">
//                         <SelectValue placeholder="Select product" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {products.map((p) => (
//                           <SelectItem key={p.id} value={p.id}>
//                             {p.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <Input
//                       value={item.productName}
//                       onChange={(e) => updateQuotationItem(item.id, { productName: e.target.value })}
//                       placeholder="Product name"
//                       className="text-xs"
//                     />
//                   </div>
//                   <div className="col-span-2">
//                     <Textarea
//                       value={item.description}
//                       onChange={(e) => updateQuotationItem(item.id, { description: e.target.value })}
//                       rows={2}
//                       className="text-sm"
//                     />
//                   </div>
//                   <div className="col-span-1">
//                     <Input
//                       type="number"
//                       value={item.quantity}
//                       onChange={(e) => {
//                         updateQuotationItem(item.id, { quantity: parseFloat(e.target.value) || 0 });
//                         calculateTotals();
//                       }}
//                       className="text-sm"
//                     />
//                   </div>
//                   <div className="col-span-1">
//                     <Input
//                       type="number"
//                       value={item.rate}
//                       onChange={(e) => {
//                         updateQuotationItem(item.id, { rate: parseFloat(e.target.value) || 0 });
//                         calculateTotals();
//                       }}
//                       className="text-sm"
//                     />
//                   </div>
//                   <div className="col-span-1 space-y-1">
//                     <Input
//                       type="number"
//                       value={item.discount}
//                       onChange={(e) => {
//                         updateQuotationItem(item.id, { discount: parseFloat(e.target.value) || 0 });
//                         calculateTotals();
//                       }}
//                       className="text-sm"
//                     />
//                     <Select
//                       value={item.discountType}
//                       onValueChange={(value: 'percentage' | 'fixed') => {
//                         updateQuotationItem(item.id, { discountType: value });
//                         calculateTotals();
//                       }}
//                     >
//                       <SelectTrigger className="text-xs h-6">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="percentage">%</SelectItem>
//                         <SelectItem value="fixed">Fixed</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="col-span-1 space-y-1">
//                     <Input
//                       type="number"
//                       value={item.tax}
//                       onChange={(e) => {
//                         updateQuotationItem(item.id, { tax: parseFloat(e.target.value) || 0 });
//                         calculateTotals();
//                       }}
//                       className="text-sm"
//                     />
//                     <Select
//                       value={item.taxType}
//                       onValueChange={(value: 'percentage' | 'fixed') => {
//                         updateQuotationItem(item.id, { taxType: value });
//                         calculateTotals();
//                       }}
//                     >
//                       <SelectTrigger className="text-xs h-6">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="percentage">%</SelectItem>
//                         <SelectItem value="fixed">Fixed</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="col-span-1">
//                     <Input
//                       type="number"
//                       value={item.serviceCharges}
//                       onChange={(e) => {
//                         updateQuotationItem(item.id, { serviceCharges: parseFloat(e.target.value) || 0 });
//                         calculateTotals();
//                       }}
//                       className="text-sm"
//                     />
//                   </div>
//                   <div className="col-span-1">
//                     <Input
//                       value={formatAmount(item.amount)}
//                       readOnly
//                       className="bg-gray-50 text-sm font-medium"
//                     />
//                   </div>
//                   <div className="col-span-1">
//                     <Button
//                       onClick={() => removeQuotationItem(item.id)}
//                       variant="destructive"
//                       size="sm"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Summary */}
//             <div className="space-y-4">
//               <h4 className="font-semibold text-lg">Summary</h4>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className="space-y-2">
//                   <Label>Currency</Label>
//                   <Select
//                     value={section.data.currency}
//                     onValueChange={(value) => updateSectionData(section.id, { currency: value })}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="AED">AED</SelectItem>
//                       <SelectItem value="USD">USD</SelectItem>
//                       <SelectItem value="EUR">EUR</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Service Charges</Label>
//                   <Input
//                     type="number"
//                     value={section.data.serviceCharges}
//                     onChange={(e) => {
//                       updateSectionData(section.id, { serviceCharges: parseFloat(e.target.value) || 0 });
//                       calculateTotals();
//                     }}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Notes</Label>
//                   <Textarea
//                     value={section.data.notes}
//                     onChange={(e) => updateSectionData(section.id, { notes: e.target.value })}
//                     rows={2}
//                     placeholder="Additional notes..."
//                   />
//                 </div>
//               </div>

//               {/* Totals */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
//                 <div className="text-center">
//                   <p className="text-sm text-gray-600">Subtotal</p>
//                   <p className="text-lg font-bold text-gray-900">
//                     {formatAmount(section.data.subtotal)}
//                   </p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-sm text-gray-600">Discount</p>
//                   <p className="text-lg font-bold text-green-600">
//                     -{formatAmount(section.data.totalDiscount)}
//                   </p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-sm text-gray-600">Tax</p>
//                   <p className="text-lg font-bold text-blue-600">
//                     +{formatAmount(section.data.totalTax)}
//                   </p>
//                 </div>
//                 <div className="text-center">
//                   <p className="text-sm text-gray-600">Grand Total</p>
//                   <p className="text-2xl font-bold text-red-600">
//                     {formatAmount(section.data.grandTotal)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 'timeline_schedule':
//         return (
//           <div className="space-y-6">
//             {/* Project Overview */}
//             <div className="grid grid-cols-3 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="totalDuration">Total Duration</Label>
//                 <Input
//                   id="totalDuration"
//                   value={section.data.totalDuration}
//                   onChange={(e) => updateSectionData(section.id, { totalDuration: e.target.value })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="startDate">Start Date</Label>
//                 <Input
//                   id="startDate"
//                   type="date"
//                   value={section.data.startDate}
//                   onChange={(e) => updateSectionData(section.id, { startDate: e.target.value })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="endDate">End Date</Label>
//                 <Input
//                   id="endDate"
//                   type="date"
//                   value={section.data.endDate}
//                   onChange={(e) => updateSectionData(section.id, { endDate: e.target.value })}
//                 />
//               </div>
//             </div>

//             {/* Project Phases */}
//             <div className="space-y-4">
//               <h4 className="font-semibold text-lg">Project Phases</h4>
//               {section.data.phases.map((phase: any, index: number) => (
//                 <Card key={index} className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                     <div className="space-y-2">
//                       <Label>Phase Name</Label>
//                       <Input
//                         value={phase.name}
//                         onChange={(e) => {
//                           const newPhases = [...section.data.phases];
//                           newPhases[index].name = e.target.value;
//                           updateSectionData(section.id, { phases: newPhases });
//                         }}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Duration</Label>
//                       <Input
//                         value={phase.duration}
//                         onChange={(e) => {
//                           const newPhases = [...section.data.phases];
//                           newPhases[index].duration = e.target.value;
//                           updateSectionData(section.id, { phases: newPhases });
//                         }}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Start Date</Label>
//                       <Input
//                         type="date"
//                         value={phase.startDate}
//                         onChange={(e) => {
//                           const newPhases = [...section.data.phases];
//                           newPhases[index].startDate = e.target.value;
//                           updateSectionData(section.id, { phases: newPhases });
//                         }}
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <Label>Deliverables</Label>
//                       <Textarea
//                         value={phase.deliverables.join('\n')}
//                         onChange={(e) => {
//                           const newPhases = [...section.data.phases];
//                           newPhases[index].deliverables = e.target.value.split('\n');
//                           updateSectionData(section.id, { phases: newPhases });
//                         }}
//                         rows={3}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label>Milestones</Label>
//                       <Textarea
//                         value={phase.milestones.join('\n')}
//                         onChange={(e) => {
//                           const newPhases = [...section.data.phases];
//                           newPhases[index].milestones = e.target.value.split('\n');
//                           updateSectionData(section.id, { phases: newPhases });
//                         }}
//                         rows={2}
//                       />
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>

//             {/* Critical Path */}
//             <div className="space-y-2">
//               <Label>Critical Path</Label>
//               <Textarea
//                 value={section.data.criticalPath.join('\n')}
//                 onChange={(e) => updateSectionData(section.id, {
//                   criticalPath: e.target.value.split('\n')
//                 })}
//                 rows={4}
//               />
//             </div>

//             {/* Dependencies */}
//             <div className="space-y-2">
//               <Label>Dependencies</Label>
//               <Textarea
//                 value={section.data.dependencies.join('\n')}
//                 onChange={(e) => updateSectionData(section.id, {
//                   dependencies: e.target.value.split('\n')
//                 })}
//                 rows={3}
//               />
//             </div>

//             {/* Risks */}
//             <div className="space-y-4">
//               <Label>Risks & Mitigation</Label>
//               {section.data.risks.map((risk: any, index: number) => (
//                 <div key={index} className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
//                   <div className="flex-1 space-y-2">
//                     <Input
//                       value={risk.risk}
//                       onChange={(e) => {
//                         const newRisks = [...section.data.risks];
//                         newRisks[index].risk = e.target.value;
//                         updateSectionData(section.id, { risks: newRisks });
//                       }}
//                       placeholder="Risk description"
//                     />
//                   </div>
//                   <Select
//                     value={risk.impact}
//                     onValueChange={(value) => {
//                       const newRisks = [...section.data.risks];
//                       newRisks[index].impact = value;
//                       updateSectionData(section.id, { risks: newRisks });
//                     }}
//                   >
//                     <SelectTrigger className="w-24">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Low">Low</SelectItem>
//                       <SelectItem value="Medium">Medium</SelectItem>
//                       <SelectItem value="High">High</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <div className="flex-1">
//                     <Textarea
//                       value={risk.mitigation}
//                       onChange={(e) => {
//                         const newRisks = [...section.data.risks];
//                         newRisks[index].mitigation = e.target.value;
//                         updateSectionData(section.id, { risks: newRisks });
//                       }}
//                       placeholder="Mitigation strategy"
//                       rows={2}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );

//       case 'terms_warranties':
//         return (
//           <div className="space-y-6">
//             {/* General Terms */}
//             <div className="space-y-2">
//               <Label htmlFor="generalTerms">General Terms</Label>
//               <Textarea
//                 id="generalTerms"
//                 value={section.data.generalTerms}
//                 onChange={(e) => updateSectionData(section.id, { generalTerms: e.target.value })}
//                 rows={8}
//                 className="font-mono text-sm"
//               />
//             </div>

//             {/* Warranties */}
//             <div className="space-y-4">
//               <h4 className="font-semibold text-lg">Warranties</h4>
//               {section.data.warranties.map((warranty: any, index: number) => (
//                 <Card key={index} className="p-4">
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div className="space-y-2">
//                       <Label>Item</Label>
//                       <Input
//                         value={warranty.item}
//                         onChange={(e) => {
//                           const newWarranties = [...section.data.warranties];
//                           newWarranties[index].item = e.target.value;
//                           updateSectionData(section.id, { warranties: newWarranties });
//                         }}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Warranty</Label>
//                       <Input
//                         value={warranty.warranty}
//                         onChange={(e) => {
//                           const newWarranties = [...section.data.warranties];
//                           newWarranties[index].warranty = e.target.value;
//                           updateSectionData(section.id, { warranties: newWarranties });
//                         }}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Coverage</Label>
//                       <Textarea
//                         value={warranty.coverage}
//                         onChange={(e) => {
//                           const newWarranties = [...section.data.warranties];
//                           newWarranties[index].coverage = e.target.value;
//                           updateSectionData(section.id, { warranties: newWarranties });
//                         }}
//                         rows={2}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Exclusions</Label>
//                       <Textarea
//                         value={warranty.exclusions}
//                         onChange={(e) => {
//                           const newWarranties = [...section.data.warranties];
//                           newWarranties[index].exclusions = e.target.value;
//                           updateSectionData(section.id, { warranties: newWarranties });
//                         }}
//                         rows={2}
//                       />
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>

//             {/* Limitations */}
//             <div className="space-y-2">
//               <Label htmlFor="limitations">Limitations</Label>
//               <Textarea
//                 id="limitations"
//                 value={section.data.limitations}
//                 onChange={(e) => updateSectionData(section.id, { limitations: e.target.value })}
//                 rows={4}
//               />
//             </div>

//             {/* Support Services */}
//             <div className="space-y-4">
//               <h4 className="font-semibold text-lg">Support Services</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <h5 className="font-medium text-green-700">Included Services</h5>
//                   <div className="space-y-2">
//                     {section.data.supportServices.included.map((service: string, index: number) => (
//                       <div key={index} className="flex items-center space-x-2">
//                         <span className="text-green-600 font-bold">✓</span>
//                         <Input
//                           value={service}
//                           onChange={(e) => {
//                             const newIncluded = [...section.data.supportServices.included];
//                             newIncluded[index] = e.target.value;
//                             updateSectionData(section.id, {
//                               supportServices: {
//                                 ...section.data.supportServices,
//                                 included: newIncluded
//                               }
//                             });
//                           }}
//                           className="flex-1"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <h5 className="font-medium text-blue-700">Optional Services</h5>
//                   <div className="space-y-2">
//                     {section.data.supportServices.optional.map((service: string, index: number) => (
//                       <div key={index} className="flex items-center space-x-2">
//                         <span className="text-blue-600 font-bold">+</span>
//                         <Input
//                           value={service}
//                           onChange={(e) => {
//                             const newOptional = [...section.data.supportServices.optional];
//                             newOptional[index] = e.target.value;
//                             updateSectionData(section.id, {
//                               supportServices: {
//                                 ...section.data.supportServices,
//                                 optional: newOptional
//                               }
//                             });
//                           }}
//                           className="flex-1"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Termination Clauses */}
//             <div className="space-y-2">
//               <Label htmlFor="terminationClauses">Termination Clauses</Label>
//               <Textarea
//                 id="terminationClauses"
//                 value={section.data.terminationClauses}
//                 onChange={(e) => updateSectionData(section.id, { terminationClauses: e.target.value })}
//                 rows={4}
//               />
//             </div>

//             {/* Governing Law */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="governingLaw">Governing Law</Label>
//                 <Input
//                   id="governingLaw"
//                   value={section.data.governingLaw}
//                   onChange={(e) => updateSectionData(section.id, { governingLaw: e.target.value })}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="disputeResolution">Dispute Resolution</Label>
//                 <Input
//                   id="disputeResolution"
//                   value={section.data.disputeResolution}
//                   onChange={(e) => updateSectionData(section.id, { disputeResolution: e.target.value })}
//                 />
//               </div>
//             </div>
//           </div>
//         );

//       case 'contact_information':
//         return (
//           <div className="space-y-6">
//             {/* Company Contacts */}
//             <div className="space-y-4">
//               <h4 className="font-semibold text-lg">Company Contacts</h4>
//               {section.data.companyContacts.map((contact: any, index: number) => (
//                 <Card key={index} className="p-4">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="space-y-2">
//                       <Label>Name</Label>
//                       <Input
//                         value={contact.name}
//                         onChange={(e) => {
//                           const newContacts = [...section.data.companyContacts];
//                           newContacts[index].name = e.target.value;
//                           updateSectionData(section.id, { companyContacts: newContacts });
//                         }}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Title</Label>
//                       <Input
//                         value={contact.title}
//                         onChange={(e) => {
//                           const newContacts = [...section.data.companyContacts];
//                           newContacts[index].title = e.target.value;
//                           updateSectionData(section.id, { companyContacts: newContacts });
//                         }}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Department</Label>
//                       <Input
//                         value={contact.department}
//                         onChange={(e) => {
//                           const newContacts = [...section.data.companyContacts];
//                           newContacts[index].department = e.target.value;
//                           updateSectionData(section.id, { companyContacts: newContacts });
//                         }}
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                     <div className="space-y-2">
//                       <Label>Phone</Label>
//                       <Input
//                         value={contact.phone}
//                         onChange={(e) => {
//                           const newContacts = [...section.data.companyContacts];
//                           newContacts[index].phone = e.target.value;
//                           updateSectionData(section.id, { companyContacts: newContacts });
//                         }}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Email</Label>
//                       <Input
//                         type="email"
//                         value={contact.email}
//                         onChange={(e) => {
//                           const newContacts = [...section.data.companyContacts];
//                           newContacts[index].email = e.target.value;
//                           updateSectionData(section.id, { companyContacts: newContacts });
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>

//             {/* Client Contacts */}
//             <div className="space-y-4">
//               <h4 className="font-semibold text-lg">Client Contacts</h4>
//               {section.data.clientContacts.map((contact: any, index: number) => (
//                 <Card key={index} className="p-4">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="space-y-2">
//                       <Label>Name</Label>
//                       <Input
//                         value={contact.name}
//                         onChange={(e) => {
//                           const newContacts = [...section.data.clientContacts];
//                           newContacts[index].name = e.target.value;
//                           updateSectionData(section.id, { clientContacts: newContacts });
//                         }}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Title</Label>
//                       <Input
//                         value={contact.title}
//                         onChange={(e) => {
//                           const newContacts = [...section.data.clientContacts];
//                           newContacts[index].title = e.target.value;
//                           updateSectionData(section.id, { clientContacts: newContacts });
//                         }}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Department</Label>
//                       <Input
//                         value={contact.department}
//                         onChange={(e) => {
//                           const newContacts = [...section.data.clientContacts];
//                           newContacts[index].department = e.target.value;
//                           updateSectionData(section.id, { clientContacts: newContacts });
//                         }}
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                     <div className="space-y-2">
//                       <Label>Phone</Label>
//                       <Input
//                         value={contact.phone}
//                         onChange={(e) => {
//                           const newContacts = [...section.data.clientContacts];
//                           newContacts[index].phone = e.target.value;
//                           updateSectionData(section.id, { clientContacts: newContacts });
//                         }}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Email</Label>
//                       <Input
//                         type="email"
//                         value={contact.email}
//                         onChange={(e) => {
//                           const newContacts = [...section.data.clientContacts];
//                           newContacts[index].email = e.target.value;
//                           updateSectionData(section.id, { clientContacts: newContacts });
//                         }}
//                       />
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>

//             {/* Signatures */}
//             <div className="space-y-4">
//               <h4 className="font-semibold text-lg">Signatures</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card className="p-4">
//                   <h5 className="font-medium text-blue-700 mb-4">Client Signature</h5>
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <Label>Signature</Label>
//                       <Input
//                         value={section.data.signatures.clientSignature}
//                         onChange={(e) => updateSectionData(section.id, {
//                           signatures: {
//                             ...section.data.signatures,
//                             clientSignature: e.target.value
//                           }
//                         })}
//                         placeholder="Client signature"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label>Name</Label>
//                         <Input
//                           value={section.data.signatures.clientName}
//                           onChange={(e) => updateSectionData(section.id, {
//                             signatures: {
//                               ...section.data.signatures,
//                               clientName: e.target.value
//                             }
//                           })}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Title</Label>
//                         <Input
//                           value={section.data.signatures.clientTitle}
//                           onChange={(e) => updateSectionData(section.id, {
//                             signatures: {
//                               ...section.data.signatures,
//                               clientTitle: e.target.value
//                             }
//                           })}
//                         />
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Date</Label>
//                       <Input
//                         type="date"
//                         value={section.data.signatures.clientDate}
//                         onChange={(e) => updateSectionData(section.id, {
//                           signatures: {
//                             ...section.data.signatures,
//                             clientDate: e.target.value
//                           }
//                         })}
//                       />
//                     </div>
//                   </div>
//                 </Card>

//                 <Card className="p-4">
//                   <h5 className="font-medium text-green-700 mb-4">Company Signature</h5>
//                   <div className="space-y-4">
//                     <div className="space-y-2">
//                       <Label>Signature</Label>
//                       <Input
//                         value={section.data.signatures.companySignature}
//                         onChange={(e) => updateSectionData(section.id, {
//                           signatures: {
//                             ...section.data.signatures,
//                             companySignature: e.target.value
//                           }
//                         })}
//                         placeholder="Company signature"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label>Name</Label>
//                         <Input
//                           value={section.data.signatures.companyName}
//                           onChange={(e) => updateSectionData(section.id, {
//                             signatures: {
//                               ...section.data.signatures,
//                               companyName: e.target.value
//                             }
//                           })}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Title</Label>
//                         <Input
//                           value={section.data.signatures.companyTitle}
//                           onChange={(e) => updateSectionData(section.id, {
//                             signatures: {
//                               ...section.data.signatures,
//                               companyTitle: e.target.value
//                             }
//                           })}
//                         />
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Date</Label>
//                       <Input
//                         type="date"
//                         value={section.data.signatures.companyDate}
//                         onChange={(e) => updateSectionData(section.id, {
//                           signatures: {
//                             ...section.data.signatures,
//                             companyDate: e.target.value
//                           }
//                         })}
//                       />
//                     </div>
//                   </div>
//                 </Card>
//               </div>
//             </div>

//             {/* Next Steps */}
//             <div className="space-y-4">
//               <Label>Next Steps</Label>
//               <div className="space-y-2">
//                 {section.data.nextSteps.map((step: string, index: number) => (
//                   <div key={index} className="flex items-center space-x-2">
//                     <span className="text-blue-600 font-bold">{index + 1}.</span>
//                     <Input
//                       value={step}
//                       onChange={(e) => {
//                         const newSteps = [...section.data.nextSteps];
//                         newSteps[index] = e.target.value;
//                         updateSectionData(section.id, { nextSteps: newSteps });
//                       }}
//                       className="flex-1"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Additional Notes */}
//             <div className="space-y-2">
//               <Label htmlFor="additionalNotes">Additional Notes</Label>
//               <Textarea
//                 id="additionalNotes"
//                 value={section.data.additionalNotes}
//                 onChange={(e) => updateSectionData(section.id, { additionalNotes: e.target.value })}
//                 rows={4}
//                 placeholder="Any additional notes or special instructions..."
//               />
//             </div>
//           </div>
//         );

//       default:
//         return (
//           <div className="text-center py-8 text-gray-500">
//             Section content not implemented yet
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Create New Quotation</h1>
//             <p className="text-blue-100 mt-1 text-lg">Build comprehensive sales proposals</p>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={generatePDF}>
//               <Download className="h-4 w-4 mr-2" />
//               Generate PDF
//             </Button>
//             <Button className="bg-white text-blue-600 hover:bg-blue-50" onClick={saveQuotation}>
//               <Save className="h-5 w-5 mr-2" />
//               Save Quotation
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Section Builder */}
//       <div className="space-y-4">
//         {sections.map((section) => (
//           <Card key={section.id} className="shadow-lg">
//             <CardHeader className="bg-gray-50">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
//                   <div>
//                     <CardTitle className="text-lg">{section.title}</CardTitle>
//                     <CardDescription>Section {section.order}</CardDescription>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`enable-${section.id}`}
//                     checked={section.enabled}
//                     onCheckedChange={() => toggleSection(section.id)}
//                   />
//                   <Label htmlFor={`enable-${section.id}`} className="text-sm">
//                     Enable
//                   </Label>
//                 </div>
//               </div>
//             </CardHeader>
//             {section.enabled && (
//               <CardContent className="pt-6">
//                 {renderSection(section)}
//               </CardContent>
//             )}
//           </Card>
//         ))}
//       </div>

//       {/* Action Buttons */}
//       <div className="flex items-center justify-end space-x-4 pt-6 border-t">
//         <Button variant="outline" className="px-8">
//           Save as Draft
//         </Button>
//         <Button variant="outline" className="px-8">
//           Preview
//         </Button>
//         <Button className="px-8 bg-blue-600 hover:bg-blue-700">
//           Send Quotation
//         </Button>
//       </div>
//     </div>
//   );
// }



// new code
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  Save,
  Download,
  Building2,
  FileText,
  Package,
  DollarSign,
  FileCheck,
  Handshake,
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { useCurrencyStore } from '@/stores/currency';
import mockData from '@/lib/mock-data';
import { Customer, Product } from '@/types';

interface QuotationSection {
  id: string;
  type: 'cover_page' | 'executive_summary' | 'company_introduction' | 'problem_statement' | 'solution_details' | 'product_specifications' | 'quotation_items' | 'timeline_schedule' | 'terms_warranties' | 'contact_information';
  title: string;
  enabled: boolean;
  order: number;
  data: any;
}

interface ProductDetail {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  description: string;
  images: string[];
}

interface QuotationItem {
  id: string;
  itemId: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  rate: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  tax: number;
  taxType: 'percentage' | 'fixed';
  serviceCharges: number;
  amount: number;
}

export default function NewSalesQuotationPage() {
  const { formatAmount } = useCurrencyStore();
  const [sections, setSections] = useState<QuotationSection[]>([
    {
      id: 'cover_page',
      type: 'cover_page',
      title: 'Cover Page & Letter',
      enabled: true,
      order: 1,
      data: {
        companyLogo: mockData.companySettings.logoUrl,
        companyName: mockData.companySettings.companyName,
        companyAddress: `${mockData.companySettings.address.street}, ${mockData.companySettings.address.city}, ${mockData.companySettings.address.state} ${mockData.companySettings.address.zipCode}, ${mockData.companySettings.address.country}`,
        companyPhone: mockData.companySettings.contact.phone,
        companyEmail: mockData.companySettings.contact.email,
        companyWebsite: mockData.companySettings.contact.website,
        date: new Date().toISOString().split('T')[0],
        recipientName: '',
        recipientCompany: '',
        recipientAddress: '',
        recipientPhone: '',
        recipientEmail: '',
        subject: 'Proposal for Professional Services',
        salutation: 'Dear [Recipient Name],',
        letterContent: `We are pleased to submit this comprehensive proposal for your consideration. Our team has carefully analyzed your requirements and developed a tailored solution that meets your specific needs.

This proposal outlines our understanding of your project requirements, our proposed solution, detailed specifications, pricing structure, and implementation timeline.

We look forward to the opportunity to work with you and deliver exceptional results.`,
        senderName: 'Sales Representative',
        senderTitle: 'Sales Executive',
        senderPhone: '+971 50 123 4567',
        senderEmail: 'sales@sbrtech.com'
      }
    },
    {
      id: 'executive_summary',
      type: 'executive_summary',
      title: 'Executive Summary',
      enabled: true,
      order: 2,
      data: {
        summary: `This proposal presents a comprehensive solution tailored to meet your specific business requirements. Our experienced team brings deep industry knowledge and proven methodologies to deliver exceptional results.

Key highlights of our proposal include:
• Customized solution addressing your unique challenges
• Competitive pricing with flexible payment terms
• Proven track record of successful project delivery
• Comprehensive support and maintenance services
• Commitment to quality and customer satisfaction

We are confident that our solution will exceed your expectations and deliver significant value to your organization.`,
        keyBenefits: [
          'Cost-effective solution with ROI within 6 months',
          'Streamlined processes reducing operational overhead by 30%',
          'Scalable architecture supporting future growth',
          '24/7 technical support and maintenance',
          'Comprehensive training and knowledge transfer'
        ],
        proposalValue: '',
        estimatedDuration: '3-6 months',
        totalInvestment: ''
      }
    },
    {
      id: 'quotation_items',
      type: 'quotation_items',
      title: 'Quotation Items',
      enabled: true,
      order: 3,
      data: {
        items: [] as QuotationItem[],
        subtotal: 0,
        totalDiscount: 0,
        totalTax: 0,
        serviceCharges: 0,
        grandTotal: 0,
        currency: 'AED',
        notes: ''
      }
    },
    {
      id: 'timeline_schedule',
      type: 'timeline_schedule',
      title: 'Timeline & Delivery Schedule',
      enabled: true,
      order: 4,
      data: {
        totalDuration: '16 weeks',
        startDate: '',
        endDate: '',
        phases: [
          {
            name: 'Planning & Analysis',
            duration: '2 weeks',
            startDate: '',
            endDate: '',
            deliverables: [
              'Requirements gathering',
              'System analysis',
              'Project plan development',
              'Resource allocation'
            ],
            milestones: ['Kickoff meeting', 'Requirements signoff']
          },
          {
            name: 'Design & Development',
            duration: '8 weeks',
            startDate: '',
            endDate: '',
            deliverables: [
              'System design documents',
              'UI/UX mockups',
              'Database design',
              'Core functionality development',
              'Integration development'
            ],
            milestones: ['Design approval', 'Development completion', 'Testing phase start']
          },
          {
            name: 'Testing & Quality Assurance',
            duration: '3 weeks',
            startDate: '',
            endDate: '',
            deliverables: [
              'Unit testing',
              'Integration testing',
              'User acceptance testing',
              'Performance testing',
              'Security testing'
            ],
            milestones: ['QA completion', 'UAT signoff']
          },
          {
            name: 'Deployment & Training',
            duration: '3 weeks',
            startDate: '',
            endDate: '',
            deliverables: [
              'Production deployment',
              'Data migration',
              'User training sessions',
              'Documentation delivery',
              'Go-live support'
            ],
            milestones: ['Go-live', 'Training completion', 'Project closure']
          }
        ],
        criticalPath: [
          'Requirements analysis completion',
          'Design approval',
          'Development milestone reviews',
          'Testing completion',
          'User acceptance signoff'
        ],
        dependencies: [
          'Phase 2 cannot start until Phase 1 requirements are approved',
          'Phase 3 testing requires Phase 2 development completion',
          'Phase 4 deployment requires Phase 3 testing signoff'
        ],
        risks: [
          {
            risk: 'Resource availability',
            impact: 'Medium',
            mitigation: 'Backup resource planning and cross-training'
          },
          {
            risk: 'Third-party integration delays',
            impact: 'High',
            mitigation: 'Early vendor engagement and contingency planning'
          },
          {
            risk: 'Scope changes',
            impact: 'Medium',
            mitigation: 'Change control process and regular scope reviews'
          }
        ]
      }
    },
    {
      id: 'terms_warranties',
      type: 'terms_warranties',
      title: 'Terms & Warranties',
      enabled: true,
      order: 5,
      data: {
        generalTerms: `1. **Acceptance**: This proposal constitutes the entire agreement between the parties.
2. **Validity**: This proposal is valid for 30 days from the date of submission.
3. **Payment Terms**: All payments must be made according to the agreed schedule.
4. **Intellectual Property**: All deliverables remain the property of the client upon full payment.
5. **Confidentiality**: Both parties agree to maintain confidentiality of proprietary information.`,
        warranties: [
          {
            item: 'Software Functionality',
            warranty: '12 months from go-live date',
            coverage: 'Bugs and defects in core functionality',
            exclusions: 'Custom modifications, third-party integrations'
          },
          {
            item: 'System Performance',
            warranty: '99.5% uptime SLA',
            coverage: 'System availability and performance',
            exclusions: 'Scheduled maintenance, force majeure events'
          },
          {
            item: 'Data Security',
            warranty: 'Industry-standard security measures',
            coverage: 'Data protection and privacy compliance',
            exclusions: 'Client data breaches due to misuse'
          }
        ],
        limitations: `• Warranty does not cover damages due to misuse or unauthorized modifications
• Warranty is limited to the original specifications and scope
• Third-party components are covered by their respective vendor warranties
• Warranty claims must be reported within 30 days of discovery`,
        supportServices: {
          included: [
            '24/7 system monitoring',
            'Email support during business hours',
            'Phone support for critical issues',
            'Regular system updates and patches',
            'Knowledge base and documentation access'
          ],
          optional: [
            'Dedicated support engineer',
            'On-site support visits',
            'Extended warranty coverage',
            'Custom training sessions',
            'Emergency response service'
          ]
        },
        terminationClauses: `Either party may terminate this agreement with 30 days written notice. In case of termination:
• Client will pay for all services rendered up to termination date
• All intellectual property rights transfer to client
• Confidential information remains protected
• Outstanding payments become immediately due`,
        governingLaw: 'United Arab Emirates',
        disputeResolution: 'Arbitration in Dubai International Arbitration Centre'
      }
    },
    {
      id: 'contact_information',
      type: 'contact_information',
      title: 'Contact Information & Signatures',
      enabled: true,
      order: 6,
      data: {
        companyContacts: [
          {
            name: 'Sales Representative',
            title: 'Sales Executive',
            phone: '+971 50 123 4567',
            email: 'sales@sbrtech.com',
            department: 'Sales'
          },
          {
            name: 'Technical Support',
            title: 'Support Specialist',
            phone: '+971 50 765 4321',
            email: 'support@sbrtech.com',
            department: 'Technical'
          }
        ],
        clientContacts: [
          {
            name: '',
            title: '',
            phone: '',
            email: '',
            department: ''
          }
        ],
        signatures: {
          clientSignature: '',
          clientName: '',
          clientTitle: '',
          clientDate: '',
          companySignature: 'Sales Representative',
          companyTitle: 'Sales Executive',
          companyDate: new Date().toISOString().split('T')[0]
        },
        nextSteps: [
          'Review and approval of proposal',
          'Contract signing and legal review',
          'Project kickoff meeting scheduling',
          'Resource allocation and team assignment',
          'Detailed project planning and timeline confirmation'
        ],
        additionalNotes: ''
      }
    }
  ]);

  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const dragOverRef = useRef<HTMLDivElement>(null);

  const customers = mockData.customers;
  const products = mockData.products;

  const moveSection = (fromIndex: number, toIndex: number) => {
    const newSections = [...sections];
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);

    // Update order numbers
    newSections.forEach((section, index) => {
      section.order = index + 1;
    });

    setSections(newSections);
  };

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, enabled: !section.enabled }
        : section
    ));
  };

  const updateSectionData = (sectionId: string, data: any) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? { ...section, data: { ...section.data, ...data } }
        : section
    ));
  };

  const addQuotationItem = () => {
    const quotationSection = sections.find(s => s.type === 'quotation_items');
    if (quotationSection) {
      const newItem: QuotationItem = {
        id: `item_${Date.now()}`,
        itemId: `Q${(quotationSection.data.items.length + 1).toString().padStart(3, '0')}`,
        productId: '',
        productName: '',
        description: '',
        quantity: 1,
        rate: 0,
        discount: 0,
        discountType: 'percentage',
        tax: 0,
        taxType: 'percentage',
        serviceCharges: 0,
        amount: 0
      };

      updateSectionData('quotation_items', {
        items: [...quotationSection.data.items, newItem]
      });
    }
  };

  const removeQuotationItem = (itemId: string) => {
    const quotationSection = sections.find(s => s.type === 'quotation_items');
    if (quotationSection) {
      updateSectionData('quotation_items', {
        items: quotationSection.data.items.filter((item: QuotationItem) => item.id !== itemId)
      });
      calculateTotals();
    }
  };

  const updateQuotationItem = (itemId: string, data: Partial<QuotationItem>) => {
    const quotationSection = sections.find(s => s.type === 'quotation_items');
    if (quotationSection) {
      const updatedItems = quotationSection.data.items.map((item: QuotationItem) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, ...data };
          // Calculate amount
          const subtotal = updatedItem.quantity * updatedItem.rate;
          const discountAmount = updatedItem.discountType === 'percentage'
            ? subtotal * (updatedItem.discount / 100)
            : updatedItem.discount;
          const taxableAmount = subtotal - discountAmount;
          const taxAmount = updatedItem.taxType === 'percentage'
            ? taxableAmount * (updatedItem.tax / 100)
            : updatedItem.tax;
          updatedItem.amount = taxableAmount + taxAmount + updatedItem.serviceCharges;
          return updatedItem;
        }
        return item;
      });

      updateSectionData('quotation_items', { items: updatedItems });
    }
  };

  // Updated function to handle product selection with quantity merge
  const handleProductSelect = (itemId: string, productId: string) => {
    const quotationSection = sections.find(s => s.type === 'quotation_items');
    if (!quotationSection) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if this product already exists in the quotation items
    const existingItem = quotationSection.data.items.find((item: QuotationItem) => 
      item.productId === productId && item.id !== itemId
    );

    if (existingItem) {
      // If product already exists, increase quantity of existing item and remove the new item
      const updatedItems = quotationSection.data.items.map((item: QuotationItem) => {
        if (item.id === existingItem.id) {
          return {
            ...item,
            quantity: item.quantity + 1
          };
        }
        return item;
      }).filter((item: QuotationItem) => item.id !== itemId); // Remove the duplicate item

      updateSectionData('quotation_items', { items: updatedItems });
    } else {
      // If product doesn't exist, add it normally
      updateQuotationItem(itemId, {
        productId: productId,
        productName: product.name,
        description: product.description,
        rate: product.sellingPrice
      });
    }
    
    calculateTotals();
  };

  const calculateTotals = () => {
    const quotationSection = sections.find(s => s.type === 'quotation_items');

    if (!quotationSection) return;

    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    quotationSection.data.items.forEach((item: QuotationItem) => {
      const itemSubtotal = item.quantity * item.rate;
      const itemDiscount = item.discountType === 'percentage'
        ? itemSubtotal * (item.discount / 100)
        : item.discount;
      const itemTax = item.taxType === 'percentage'
        ? (itemSubtotal - itemDiscount) * (item.tax / 100)
        : item.tax;

      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;
      totalTax += itemTax;
    });

    const grandTotal = subtotal - totalDiscount + totalTax + quotationSection.data.serviceCharges;

    updateSectionData('quotation_items', {
      subtotal,
      totalDiscount,
      totalTax,
      grandTotal
    });
  };

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    if (!draggedSection || draggedSection === targetSectionId) return;

    const fromIndex = sections.findIndex(s => s.id === draggedSection);
    const toIndex = sections.findIndex(s => s.id === targetSectionId);

    moveSection(fromIndex, toIndex);
    setDraggedSection(null);
  };

  const generatePDF = () => {
    const enabledSections = sections.filter(s => s.enabled);
    // PDF generation logic would go here
    console.log('Generating PDF with sections:', enabledSections);
    alert('PDF generation feature would be implemented here');
  };

  const saveQuotation = () => {
    // Save quotation logic would go here
    alert('Quotation saved successfully!');
  };

  const renderSection = (section: QuotationSection) => {
    switch (section.type) {
      case 'executive_summary':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="summary">Executive Summary</Label>
              <Textarea
                id="summary"
                value={section.data.summary}
                onChange={(e) => updateSectionData(section.id, { summary: e.target.value })}
                rows={8}
                className="text-lg leading-relaxed"
              />
            </div>

            <div className="space-y-4">
              <Label>Key Benefits</Label>
              <div className="space-y-2">
                {section.data.keyBenefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-green-600 font-bold">•</span>
                    <Input
                      value={benefit}
                      onChange={(e) => {
                        const newBenefits = [...section.data.keyBenefits];
                        newBenefits[index] = e.target.value;
                        updateSectionData(section.id, { keyBenefits: newBenefits });
                      }}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proposalValue">Proposal Value</Label>
                <Input
                  id="proposalValue"
                  value={section.data.proposalValue}
                  onChange={(e) => updateSectionData(section.id, { proposalValue: e.target.value })}
                  placeholder="e.g., $500,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                <Input
                  id="estimatedDuration"
                  value={section.data.estimatedDuration}
                  onChange={(e) => updateSectionData(section.id, { estimatedDuration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalInvestment">Total Investment</Label>
                <Input
                  id="totalInvestment"
                  value={section.data.totalInvestment}
                  onChange={(e) => updateSectionData(section.id, { totalInvestment: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 'quotation_items':
        return (
          <div className="space-y-6">
            {/* Quotation Items Table */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-lg">Quotation Items</h4>
                <Button onClick={addQuotationItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg font-medium text-sm">
                <div className="col-span-1">Item ID</div>
                <div className="col-span-2">Product</div>
                <div className="col-span-2">Description</div>
                <div className="col-span-1">Qty</div>
                <div className="col-span-1">Rate</div>
                <div className="col-span-1">Discount</div>
                <div className="col-span-1">Tax</div>
                <div className="col-span-1">Service</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Items */}
              {section.data.items.map((item: QuotationItem, index: number) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 p-3 border rounded-lg">
                  <div className="col-span-1">
                    <Input
                      value={item.itemId}
                      onChange={(e) => updateQuotationItem(item.id, { itemId: e.target.value })}
                      placeholder="001"
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Select
                      value={item.productId}
                      onValueChange={(value) => handleProductSelect(item.id, value)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={item.productName}
                      onChange={(e) => updateQuotationItem(item.id, { productName: e.target.value })}
                      placeholder="Product name"
                      className="text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateQuotationItem(item.id, { description: e.target.value })}
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        updateQuotationItem(item.id, { quantity: parseFloat(e.target.value) || 0 });
                        calculateTotals();
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => {
                        updateQuotationItem(item.id, { rate: parseFloat(e.target.value) || 0 });
                        calculateTotals();
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-1 space-y-1">
                    <Input
                      type="number"
                      value={item.discount}
                      onChange={(e) => {
                        updateQuotationItem(item.id, { discount: parseFloat(e.target.value) || 0 });
                        calculateTotals();
                      }}
                      className="text-sm"
                    />
                    <Select
                      value={item.discountType}
                      onValueChange={(value: 'percentage' | 'fixed') => {
                        updateQuotationItem(item.id, { discountType: value });
                        calculateTotals();
                      }}
                    >
                      <SelectTrigger className="text-xs h-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">%</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1 space-y-1">
                    <Input
                      type="number"
                      value={item.tax}
                      onChange={(e) => {
                        updateQuotationItem(item.id, { tax: parseFloat(e.target.value) || 0 });
                        calculateTotals();
                      }}
                      className="text-sm"
                    />
                    <Select
                      value={item.taxType}
                      onValueChange={(value: 'percentage' | 'fixed') => {
                        updateQuotationItem(item.id, { taxType: value });
                        calculateTotals();
                      }}
                    >
                      <SelectTrigger className="text-xs h-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">%</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Input
                      type="number"
                      value={item.serviceCharges}
                      onChange={(e) => {
                        updateQuotationItem(item.id, { serviceCharges: parseFloat(e.target.value) || 0 });
                        calculateTotals();
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      value={formatAmount(item.amount)}
                      readOnly
                      className="bg-gray-50 text-sm font-medium"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      onClick={() => removeQuotationItem(item.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={section.data.currency}
                    onValueChange={(value) => updateSectionData(section.id, { currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Service Charges</Label>
                  <Input
                    type="number"
                    value={section.data.serviceCharges}
                    onChange={(e) => {
                      updateSectionData(section.id, { serviceCharges: parseFloat(e.target.value) || 0 });
                      calculateTotals();
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={section.data.notes}
                    onChange={(e) => updateSectionData(section.id, { notes: e.target.value })}
                    rows={2}
                    placeholder="Additional notes..."
                  />
                </div>
              </div>

              {/* Totals */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatAmount(section.data.subtotal)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Discount</p>
                  <p className="text-lg font-bold text-green-600">
                    -{formatAmount(section.data.totalDiscount)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tax</p>
                  <p className="text-lg font-bold text-blue-600">
                    +{formatAmount(section.data.totalTax)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Grand Total</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatAmount(section.data.grandTotal)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'timeline_schedule':
        return (
          <div className="space-y-6">
            {/* Project Overview */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalDuration">Total Duration</Label>
                <Input
                  id="totalDuration"
                  value={section.data.totalDuration}
                  onChange={(e) => updateSectionData(section.id, { totalDuration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={section.data.startDate}
                  onChange={(e) => updateSectionData(section.id, { startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={section.data.endDate}
                  onChange={(e) => updateSectionData(section.id, { endDate: e.target.value })}
                />
              </div>
            </div>

            {/* Project Phases */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Project Phases</h4>
              {section.data.phases.map((phase: any, index: number) => (
                <Card key={index} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>Phase Name</Label>
                      <Input
                        value={phase.name}
                        onChange={(e) => {
                          const newPhases = [...section.data.phases];
                          newPhases[index].name = e.target.value;
                          updateSectionData(section.id, { phases: newPhases });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input
                        value={phase.duration}
                        onChange={(e) => {
                          const newPhases = [...section.data.phases];
                          newPhases[index].duration = e.target.value;
                          updateSectionData(section.id, { phases: newPhases });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={phase.startDate}
                        onChange={(e) => {
                          const newPhases = [...section.data.phases];
                          newPhases[index].startDate = e.target.value;
                          updateSectionData(section.id, { phases: newPhases });
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Deliverables</Label>
                      <Textarea
                        value={phase.deliverables.join('\n')}
                        onChange={(e) => {
                          const newPhases = [...section.data.phases];
                          newPhases[index].deliverables = e.target.value.split('\n');
                          updateSectionData(section.id, { phases: newPhases });
                        }}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Milestones</Label>
                      <Textarea
                        value={phase.milestones.join('\n')}
                        onChange={(e) => {
                          const newPhases = [...section.data.phases];
                          newPhases[index].milestones = e.target.value.split('\n');
                          updateSectionData(section.id, { phases: newPhases });
                        }}
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Critical Path */}
            <div className="space-y-2">
              <Label>Critical Path</Label>
              <Textarea
                value={section.data.criticalPath.join('\n')}
                onChange={(e) => updateSectionData(section.id, {
                  criticalPath: e.target.value.split('\n')
                })}
                rows={4}
              />
            </div>

            {/* Dependencies */}
            <div className="space-y-2">
              <Label>Dependencies</Label>
              <Textarea
                value={section.data.dependencies.join('\n')}
                onChange={(e) => updateSectionData(section.id, {
                  dependencies: e.target.value.split('\n')
                })}
                rows={3}
              />
            </div>

            {/* Risks */}
            <div className="space-y-4">
              <Label>Risks & Mitigation</Label>
              {section.data.risks.map((risk: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={risk.risk}
                      onChange={(e) => {
                        const newRisks = [...section.data.risks];
                        newRisks[index].risk = e.target.value;
                        updateSectionData(section.id, { risks: newRisks });
                      }}
                      placeholder="Risk description"
                    />
                  </div>
                  <Select
                    value={risk.impact}
                    onValueChange={(value) => {
                      const newRisks = [...section.data.risks];
                      newRisks[index].impact = value;
                      updateSectionData(section.id, { risks: newRisks });
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex-1">
                    <Textarea
                      value={risk.mitigation}
                      onChange={(e) => {
                        const newRisks = [...section.data.risks];
                        newRisks[index].mitigation = e.target.value;
                        updateSectionData(section.id, { risks: newRisks });
                      }}
                      placeholder="Mitigation strategy"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'terms_warranties':
        return (
          <div className="space-y-6">
            {/* General Terms */}
            <div className="space-y-2">
              <Label htmlFor="generalTerms">General Terms</Label>
              <Textarea
                id="generalTerms"
                value={section.data.generalTerms}
                onChange={(e) => updateSectionData(section.id, { generalTerms: e.target.value })}
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            {/* Warranties */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Warranties</h4>
              {section.data.warranties.map((warranty: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Item</Label>
                      <Input
                        value={warranty.item}
                        onChange={(e) => {
                          const newWarranties = [...section.data.warranties];
                          newWarranties[index].item = e.target.value;
                          updateSectionData(section.id, { warranties: newWarranties });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Warranty</Label>
                      <Input
                        value={warranty.warranty}
                        onChange={(e) => {
                          const newWarranties = [...section.data.warranties];
                          newWarranties[index].warranty = e.target.value;
                          updateSectionData(section.id, { warranties: newWarranties });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Coverage</Label>
                      <Textarea
                        value={warranty.coverage}
                        onChange={(e) => {
                          const newWarranties = [...section.data.warranties];
                          newWarranties[index].coverage = e.target.value;
                          updateSectionData(section.id, { warranties: newWarranties });
                        }}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Exclusions</Label>
                      <Textarea
                        value={warranty.exclusions}
                        onChange={(e) => {
                          const newWarranties = [...section.data.warranties];
                          newWarranties[index].exclusions = e.target.value;
                          updateSectionData(section.id, { warranties: newWarranties });
                        }}
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Limitations */}
            <div className="space-y-2">
              <Label htmlFor="limitations">Limitations</Label>
              <Textarea
                id="limitations"
                value={section.data.limitations}
                onChange={(e) => updateSectionData(section.id, { limitations: e.target.value })}
                rows={4}
              />
            </div>

            {/* Support Services */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Support Services</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="font-medium text-green-700">Included Services</h5>
                  <div className="space-y-2">
                    {section.data.supportServices.included.map((service: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <Input
                          value={service}
                          onChange={(e) => {
                            const newIncluded = [...section.data.supportServices.included];
                            newIncluded[index] = e.target.value;
                            updateSectionData(section.id, {
                              supportServices: {
                                ...section.data.supportServices,
                                included: newIncluded
                              }
                            });
                          }}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="font-medium text-blue-700">Optional Services</h5>
                  <div className="space-y-2">
                    {section.data.supportServices.optional.map((service: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-blue-600 font-bold">+</span>
                        <Input
                          value={service}
                          onChange={(e) => {
                            const newOptional = [...section.data.supportServices.optional];
                            newOptional[index] = e.target.value;
                            updateSectionData(section.id, {
                              supportServices: {
                                ...section.data.supportServices,
                                optional: newOptional
                              }
                            });
                          }}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Termination Clauses */}
            <div className="space-y-2">
              <Label htmlFor="terminationClauses">Termination Clauses</Label>
              <Textarea
                id="terminationClauses"
                value={section.data.terminationClauses}
                onChange={(e) => updateSectionData(section.id, { terminationClauses: e.target.value })}
                rows={4}
              />
            </div>

            {/* Governing Law */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="governingLaw">Governing Law</Label>
                <Input
                  id="governingLaw"
                  value={section.data.governingLaw}
                  onChange={(e) => updateSectionData(section.id, { governingLaw: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disputeResolution">Dispute Resolution</Label>
                <Input
                  id="disputeResolution"
                  value={section.data.disputeResolution}
                  onChange={(e) => updateSectionData(section.id, { disputeResolution: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 'contact_information':
        return (
          <div className="space-y-6">
            {/* Company Contacts */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Company Contacts</h4>
              {section.data.companyContacts.map((contact: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => {
                          const newContacts = [...section.data.companyContacts];
                          newContacts[index].name = e.target.value;
                          updateSectionData(section.id, { companyContacts: newContacts });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={contact.title}
                        onChange={(e) => {
                          const newContacts = [...section.data.companyContacts];
                          newContacts[index].title = e.target.value;
                          updateSectionData(section.id, { companyContacts: newContacts });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input
                        value={contact.department}
                        onChange={(e) => {
                          const newContacts = [...section.data.companyContacts];
                          newContacts[index].department = e.target.value;
                          updateSectionData(section.id, { companyContacts: newContacts });
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={contact.phone}
                        onChange={(e) => {
                          const newContacts = [...section.data.companyContacts];
                          newContacts[index].phone = e.target.value;
                          updateSectionData(section.id, { companyContacts: newContacts });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={contact.email}
                        onChange={(e) => {
                          const newContacts = [...section.data.companyContacts];
                          newContacts[index].email = e.target.value;
                          updateSectionData(section.id, { companyContacts: newContacts });
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Client Contacts */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Client Contacts</h4>
              {section.data.clientContacts.map((contact: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) => {
                          const newContacts = [...section.data.clientContacts];
                          newContacts[index].name = e.target.value;
                          updateSectionData(section.id, { clientContacts: newContacts });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={contact.title}
                        onChange={(e) => {
                          const newContacts = [...section.data.clientContacts];
                          newContacts[index].title = e.target.value;
                          updateSectionData(section.id, { clientContacts: newContacts });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input
                        value={contact.department}
                        onChange={(e) => {
                          const newContacts = [...section.data.clientContacts];
                          newContacts[index].department = e.target.value;
                          updateSectionData(section.id, { clientContacts: newContacts });
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={contact.phone}
                        onChange={(e) => {
                          const newContacts = [...section.data.clientContacts];
                          newContacts[index].phone = e.target.value;
                          updateSectionData(section.id, { clientContacts: newContacts });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={contact.email}
                        onChange={(e) => {
                          const newContacts = [...section.data.clientContacts];
                          newContacts[index].email = e.target.value;
                          updateSectionData(section.id, { clientContacts: newContacts });
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Signatures */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Signatures</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h5 className="font-medium text-blue-700 mb-4">Client Signature</h5>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Signature</Label>
                      <Input
                        value={section.data.signatures.clientSignature}
                        onChange={(e) => updateSectionData(section.id, {
                          signatures: {
                            ...section.data.signatures,
                            clientSignature: e.target.value
                          }
                        })}
                        placeholder="Client signature"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={section.data.signatures.clientName}
                          onChange={(e) => updateSectionData(section.id, {
                            signatures: {
                              ...section.data.signatures,
                              clientName: e.target.value
                            }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={section.data.signatures.clientTitle}
                          onChange={(e) => updateSectionData(section.id, {
                            signatures: {
                              ...section.data.signatures,
                              clientTitle: e.target.value
                            }
                          })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={section.data.signatures.clientDate}
                        onChange={(e) => updateSectionData(section.id, {
                          signatures: {
                            ...section.data.signatures,
                            clientDate: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h5 className="font-medium text-green-700 mb-4">Company Signature</h5>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Signature</Label>
                      <Input
                        value={section.data.signatures.companySignature}
                        onChange={(e) => updateSectionData(section.id, {
                          signatures: {
                            ...section.data.signatures,
                            companySignature: e.target.value
                          }
                        })}
                        placeholder="Company signature"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={section.data.signatures.companyName}
                          onChange={(e) => updateSectionData(section.id, {
                            signatures: {
                              ...section.data.signatures,
                              companyName: e.target.value
                            }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={section.data.signatures.companyTitle}
                          onChange={(e) => updateSectionData(section.id, {
                            signatures: {
                              ...section.data.signatures,
                              companyTitle: e.target.value
                            }
                          })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={section.data.signatures.companyDate}
                        onChange={(e) => updateSectionData(section.id, {
                          signatures: {
                            ...section.data.signatures,
                            companyDate: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              <Label>Next Steps</Label>
              <div className="space-y-2">
                {section.data.nextSteps.map((step: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-blue-600 font-bold">{index + 1}.</span>
                    <Input
                      value={step}
                      onChange={(e) => {
                        const newSteps = [...section.data.nextSteps];
                        newSteps[index] = e.target.value;
                        updateSectionData(section.id, { nextSteps: newSteps });
                      }}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={section.data.additionalNotes}
                onChange={(e) => updateSectionData(section.id, { additionalNotes: e.target.value })}
                rows={4}
                placeholder="Any additional notes or special instructions..."
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Section content not implemented yet
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Quotation</h1>
            <p className="text-blue-100 mt-1 text-lg">Build comprehensive sales proposals</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={generatePDF}>
              <Download className="h-4 w-4 mr-2" />
              Generate PDF
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-blue-50" onClick={saveQuotation}>
              <Save className="h-5 w-5 mr-2" />
              Save Quotation
            </Button>
          </div>
        </div>
      </div>

      {/* Section Builder */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id} className="shadow-lg">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>Section {section.order}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`enable-${section.id}`}
                    checked={section.enabled}
                    onCheckedChange={() => toggleSection(section.id)}
                  />
                  <Label htmlFor={`enable-${section.id}`} className="text-sm">
                    Enable
                  </Label>
                </div>
              </div>
            </CardHeader>
            {section.enabled && (
              <CardContent className="pt-6">
                {renderSection(section)}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t">
        <Button variant="outline" className="px-8">
          Save as Draft
        </Button>
        <Button variant="outline" className="px-8">
          Preview
        </Button>
        <Button className="px-8 bg-blue-600 hover:bg-blue-700">
          Send Quotation
        </Button>
      </div>
    </div>
  );
}