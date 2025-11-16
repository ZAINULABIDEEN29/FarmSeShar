import React from "react";
import Container from "@/components/container/Container";
import { cn } from "@/lib/utils";

const OurStory: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-gray-50">
      <Container>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Centered heading */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-3xl lg:text-4xl tracking-tight leading-tight font-semibold text-gray-900 mb-4">
              Our Story
            </h2>
          </div>

          {/* Story content */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 p-8 sm:p-10 lg:p-12 xl:p-14">
            {/* Green header bar */}
            <div className="bg-green-600 h-10 sm:h-5 lg:h-20 -mx-8 sm:-mx-10 lg:-mx-12 xl:-mx-14 -mt-8 sm:-mt-10 lg:-mt-12 xl:-mt-14 mb-8 sm:mb-10 lg:mb-12"></div>
            
            <div className="space-y-6 sm:space-y-8">
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
                LocalHarvest was founded with a simple yet powerful mission: to bridge the gap between local farmers and consumers while promoting fair trade practices and sustainable agriculture. We believe that everyone deserves access to fresh, organic produce, and that farmers deserve fair compensation for their hard work.
              </p>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
                Our platform connects you directly with local farmers, eliminating unnecessary middlemen and ensuring that farmers receive a larger share of the profits. This not only supports local agriculture but also provides you with the freshest, highest-quality produce available.
              </p>
              
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal">
                We are committed to transparency, sustainability, and building a community that values local food systems. Every purchase you make on LocalHarvest directly supports local farmers and helps build a more sustainable food ecosystem for future generations.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default OurStory;

