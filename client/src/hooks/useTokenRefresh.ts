import { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { userService } from "@/services/user.service";
import { farmerService } from "@/services/farmer.service";
import { setUser, setFarmer } from "@/store/slices/authSlice";


export const useTokenRefresh = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, userType } = useAppSelector((state) => state.auth);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    if (!isAuthenticated || !userType) {
      return;
    }

    const attemptRefresh = async () => {
      if (isRefreshingRef.current) return;
      
      isRefreshingRef.current = true;
      try {
        if (userType === "user") {
          const response = await userService.refreshToken();
          if (response?.success && response?.user) {
            dispatch(setUser(response.user));
          } else {
            console.warn("Token refresh failed, but keeping session active");
          }
        } else if (userType === "farmer") {
          const response = await farmerService.refreshToken();
          if (response?.success && response?.farmer) {
            dispatch(setFarmer(response.farmer));
          } else {
            console.warn("Token refresh failed, but keeping session active");
          }
        }
      } catch (error) {
        console.error("Proactive token refresh failed:", error);
      } finally {
        isRefreshingRef.current = false;
      }
    };

    const REFRESH_INTERVAL = 14 * 60 * 1000; 

    const initialTimeout = setTimeout(() => {
      attemptRefresh();
    }, 5000); 

    refreshIntervalRef.current = setInterval(() => {
      attemptRefresh();
    }, REFRESH_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, userType, dispatch]);
};

