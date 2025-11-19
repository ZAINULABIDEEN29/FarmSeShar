import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { farmerService } from "@/services/farmer.service";
import type { UpdateFarmerProfileInput } from "@/types/farmer.types";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/store/hooks";
import { setFarmer } from "@/store/slices/authSlice";

export const farmerKeys = {
  all: ["farmer"] as const,
  profile: () => [...farmerKeys.all, "profile"] as const,
};

export const useGetFarmerProfile = () => {
  return useQuery({
    queryKey: farmerKeys.profile(),
    queryFn: () => farmerService.getCurrentFarmer(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateFarmerProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: UpdateFarmerProfileInput) => farmerService.updateProfile(data),
    onSuccess: (response) => {
      toast.success(response.message || "Profile updated successfully!");
      // Update the farmer in the Redux store
      if (response.farmer) {
        dispatch(setFarmer(response.farmer));
      }
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: farmerKeys.profile() });
      queryClient.refetchQueries({ queryKey: farmerKeys.profile() });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to update profile";
      toast.error(errorMessage);
    },
  });
};

