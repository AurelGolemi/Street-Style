// app/profile/page.tsx
// Next.js 15+ Compatible Profile Settings Page

"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Trash2, User, AlertCircle, CheckCircle, Loader, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useTransition, useActionState } from "react";

type TabType = "profile" | "email" | "password" | "danger";

interface Message {
  type: "success" | "error";
  text: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  
  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<Message | null>(null);
  
  // Email form state
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState<Message | null>(null);
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);
  
  // Account deletion state
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      startTransition(() => {
        router.push("/login?redirectTo=/profile");
      });
    }
  }, [isAuthenticated, authLoading, router]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage(null);

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setProfileMessage({ type: "success", text: "Profile updated successfully!" });
      
      // Refresh user data
      startTransition(() => {
        refreshUser();
      });
    } catch (error) {
      setProfileMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update profile",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  /**
   * Handle email change
   * Validates email format before submission
   */
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailMessage(null);

    try {
      if (!newEmail || newEmail === user?.email) {
        throw new Error("Please enter a different email address");
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        throw new Error("Please enter a valid email address");
      }

      const response = await fetch("/api/auth/update-email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update email");
      }

      setEmailMessage({
        type: "success",
        text: "Email update initiated! Please check your inbox for verification.",
      });
      setNewEmail("");
      
      startTransition(() => {
        refreshUser();
      });
    } catch (error) {
      setEmailMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update email",
      });
    } finally {
      setEmailLoading(false);
    }
  };

  /**
   * Handle password change
   * Validates password strength and match
   */
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);

    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("Please fill in all fields");
      }

      if (newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await fetch("/api/auth/update-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setPasswordMessage({ type: "success", text: "Password updated successfully!" });
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update password",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  /**
   * Handle account deletion
   * Requires explicit confirmation
   */
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      return;
    }

    const confirmed = window.confirm(
      "Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted."
    );

    if (!confirmed) return;

    setDeleteLoading(true);

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete account");
      }

      // Account deleted - redirect handled by logout
      startTransition(() => {
        router.push("/");
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete account");
      setDeleteLoading(false);
    }
  };

  /**
   * Change active tab with transition
   */
  const handleTabChange = (tab: TabType) => {
    startTransition(() => {
      setActiveTab(tab);
    });
  };

  const renderMessage = (message: Message | null) => {
    if (!message) return null;

    return (
      <div
        className={`p-4 rounded-lg flex items-start space-x-2 ${
          message.type === "success"
            ? "bg-green-50 text-green-800"
            : "bg-red-50 text-red-800"
        }`}
        role="alert"
      >
        {message.type === "success" ? (
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        )}
        <span className="text-sm">{message.text}</span>
      </div>
    );
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => startTransition(() => router.back())}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          type="button"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-700 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">{user.email}</p>
              {user.role === "admin" && (
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-purple-700 bg-purple-100 rounded">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap" role="tablist">
              {[
                { id: "profile" as const, icon: User, label: "Profile Info" },
                { id: "email" as const, icon: Mail, label: "Change Email" },
                { id: "password" as const, icon: Lock, label: "Change Password" },
                { id: "danger" as const, icon: Trash2, label: "Delete Account" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? tab.id === "danger"
                        ? "border-red-500 text-red-600"
                        : "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                  type="button"
                >
                  <tab.icon className="w-4 h-4 inline mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Info Tab */}
            {activeTab === "profile" && (
              <div role="tabpanel" id="profile-panel">
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {renderMessage(profileMessage)}

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {profileLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                        Updating Profile...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Email Change Tab */}
            {activeTab === "email" && (
              <div role="tabpanel" id="email-panel">
                <form onSubmit={handleEmailChange} className="space-y-4">
                  <div>
                    <label htmlFor="currentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Email
                    </label>
                    <input
                      id="currentEmail"
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      New Email Address
                    </label>
                    <input
                      id="newEmail"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter new email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  {renderMessage(emailMessage)}

                  <button
                    type="submit"
                    disabled={emailLoading}
                    className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {emailLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                        Updating Email...
                      </>
                    ) : (
                      "Update Email"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Password Change Tab */}
            {activeTab === "password" && (
              <div role="tabpanel" id="password-panel">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min. 8 characters)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  {renderMessage(passwordMessage)}

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                        Updating Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Delete Account Tab */}
            {activeTab === "danger" && (
              <div role="tabpanel" id="danger-panel">
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-red-900 mb-1">Danger Zone</h3>
                        <p className="text-sm text-red-800">
                          Once you delete your account, there is no going back. This action
                          cannot be undone. All your data, including cart items and order
                          history, will be permanently deleted.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="deleteConfirm" className="block text-sm font-medium text-gray-700 mb-2">
                      Type <span className="font-mono font-bold">DELETE</span> to confirm
                    </label>
                    <input
                      id="deleteConfirm"
                      type="text"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirm !== "DELETE" || deleteLoading}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    type="button"
                  >
                    {deleteLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                        Deleting Account...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account Permanently
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
