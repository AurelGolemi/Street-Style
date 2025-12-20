"use client";

import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderWrapperProps {
  onCartClick: () => void;
}

export default function HeaderWrapper({ onCartClick }: HeaderWrapperProps) {
  const { user } = useAuth();

  return (
    <Header
      onCartClick={onCartClick}
      user={
        user
          ? {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
            }
          : null
      }
    />
  );
}
