"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2, UserIcon, CreditCardIcon, KeyIcon, LogOutIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, updateUser, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateUser({
        name: formData.name,
      })

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (error) throw error

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-dream-purple" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Account Settings</h1>
        <p className="text-gray-400">Manage your account preferences and subscription</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <UserIcon className="h-5 w-5 text-dream-purple" />
              <h2 className="text-xl font-bold text-white">Profile Information</h2>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} className="glass-input" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" value={formData.email} disabled className="glass-input opacity-70" />
                  <p className="text-xs text-gray-400">Email cannot be changed</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="glass-button-primary" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <KeyIcon className="h-5 w-5 text-dream-purple" />
              <h2 className="text-xl font-bold text-white">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="glass-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="glass-input"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="glass-button-primary" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCardIcon className="h-5 w-5 text-dream-purple" />
              <h2 className="text-xl font-bold text-white">Subscription</h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Current Plan</p>
                <p className="text-lg font-medium text-white capitalize">{user.subscription_plan || "Free"}</p>
              </div>

              {user.is_subscribed && user.subscription_end_date && (
                <div>
                  <p className="text-sm text-gray-400">Renewal Date</p>
                  <p className="text-white">{new Date(user.subscription_end_date).toLocaleDateString()}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-400">Dream Credits</p>
                <p className="text-white">
                  {user.is_subscribed && user.subscription_plan === "pro" ? "Unlimited" : user.dream_credits}
                </p>
              </div>

              <Separator className="bg-dream-glass-border" />

              <Button className="glass-button w-full" onClick={() => router.push("/pricing")}>
                {user.is_subscribed ? "Manage Subscription" : "Upgrade Plan"}
              </Button>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <LogOutIcon className="h-5 w-5 text-dream-purple" />
              <h2 className="text-xl font-bold text-white">Account Actions</h2>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="glass-button w-full text-red-400 hover:text-white hover:bg-red-500/20"
                onClick={handleLogout}
              >
                Sign Out
              </Button>

              <p className="text-xs text-gray-400 text-center">Need help? Contact us at support@dreamsage.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
