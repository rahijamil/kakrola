import React from "react";
import { MessageCircle, Mail, Building } from "lucide-react";
import LandingPageHeader from "../LandingPageHeader";
import LandingPageFooter from "../LandingPageFooter";
import { notFound } from "next/navigation";

const ContactPage = () => {
  return notFound();

//   return (
//     <div className="relative overflow-hidden">
//       <LandingPageHeader />
//       <div className="wrapper py-32">
//         <div className="max-w-4xl mx-auto">
//           <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

//           <div className="grid md:grid-cols-2 gap-12">
//             <div>
//               <p className="text-xl text-gray-600 mb-8">
//                 We're here to help. Choose the best way to reach us.
//               </p>

//               <div className="space-y-6">
//                 <div className="flex items-start gap-4">
//                   <div className="p-2 rounded-lg bg-primary-50">
//                     <MessageCircle className="w-6 h-6 text-primary-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-lg">Support Chat</h3>
//                     <p className="text-gray-600 mb-2">For existing customers</p>
//                     <p className="text-sm text-gray-500">
//                       Average response: 2 hours
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="p-2 rounded-lg bg-primary-50">
//                     <Mail className="w-6 h-6 text-primary-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-lg">Email Us</h3>
//                     <p className="text-gray-600 mb-2">hello@kakrola.com</p>
//                     <p className="text-sm text-gray-500">
//                       For general inquiries
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="p-2 rounded-lg bg-primary-50">
//                     <Building className="w-6 h-6 text-primary-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-lg">Sales</h3>
//                     <p className="text-gray-600 mb-2">sales@kakrola.com</p>
//                     <p className="text-sm text-gray-500">
//                       For business inquiries
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 p-8 rounded-xl">
//               <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
//               <form className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Message
//                   </label>
//                   <textarea
//                     rows={4}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
//                 >
//                   Send Message
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Background Decoration */}
//       <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 blur-3xl opacity-20">
//         <div className="aspect-square h-96 rounded-full bg-gradient-to-br from-primary-400 to-purple-400" />
//       </div>
//       <LandingPageFooter />
//     </div>
//   );
};

export default ContactPage;
