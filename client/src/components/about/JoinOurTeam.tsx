import React from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/container/Container";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
const JoinOurTeam: React.FC = () => {
  const navigate = useNavigate();
  const handleJoinAsFarmer = () => {
    navigate("/farmer-registration");
  };
  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-28 bg-green-50">
      <Container>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 p-8 sm:p-10 lg:p-12 xl:p-14">
            {}
            <div className="bg-green-600 h-10 sm:h-5 lg:h-20 -mx-8 sm:-mx-10 lg:-mx-12 xl:-mx-14 -mt-8 sm:-mt-10 lg:-mt-12 xl:-mt-14 mb-8 sm:mb-10 lg:mb-12"></div>
            <div className="flex flex-col items-center text-center">
              {}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-6 sm:mb-8 bg-green-100 flex items-center justify-center">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
              </div>
              {}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Join Our Team
              </h2>
              {}
              <p className="text-base sm:text-lg text-gray-900 leading-relaxed font-normal mb-8 sm:mb-10 lg:mb-12 max-w-2xl">
                We're here to support you. Local Harvest gives farmers a fair marketplace to showcase their produce, connect directly with buyers, and earn more from every harvest. Start selling confidently and grow your reach in your local community.
              </p>
              {}
              <Button
                onClick={handleJoinAsFarmer}
                className={cn(
                  "bg-green-600 hover:bg-green-700 text-white font-bold",
                  "px-8 sm:px-10 lg:px-12 py-3 sm:py-4 lg:py-6",
                  "text-base sm:text-lg lg:text-xl",
                  "rounded-lg transition-colors duration-200",
                  "inline-flex items-center justify-center",
                  "border-none shadow-none"
                )}
              >
                Join as Farmer
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
export default JoinOurTeam;
