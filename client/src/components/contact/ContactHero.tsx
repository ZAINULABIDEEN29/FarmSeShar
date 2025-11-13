import React from "react";
import { MessageSquare, Sparkles } from "lucide-react";

const ContactHero: React.FC = () => {
  return (
    <section className="relative bg-linear-to-br from-green-600 via-green-500 to-emerald-600 py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 animate-fade-in">
          <Sparkles className="h-4 w-4" />
          <span>We're Here to Help</span>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl animate-pulse" />
            <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          Let's Start a
          <span className="block bg-linear-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
            Conversation
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
          Have a question or feedback? We'd love to hear from you. 
          <span className="block mt-2 text-white/80">
            Send us a message and we'll respond as soon as possible.
          </span>
        </p>
      </div>
    </section>
  );
};

export default ContactHero;

