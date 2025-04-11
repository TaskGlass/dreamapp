"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon, CalendarIcon, BrainIcon, StarIcon, Loader2, TrashIcon } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function DreamDetailPage({ params }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const { id } = params
  const [dream, setDream] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!user) return

    const fetchDream = async () => {
      try {
        const { data, error } = await supabase
          .from("dreams")
          .select(`
            *,
            interpretations (*)
          `)
          .eq("id", id)
          .single()

        if (error) throw error

        if (!data) {
          toast({
            title: "Dream not found",
            description: "The dream you're looking for doesn't exist or you don't have permission to view it.",
            variant: "destructive",
          })
          router.push("/dashboard/dreams")
          return
        }

        setDream(data)
      } catch (error) {
        console.error("Error fetching dream:", error)
        toast({
          title: "Error",
          description: "Failed to load dream details.",
          variant: "destructive",
        })
        router.push("/dashboard/dreams")
      } finally {
        setLoading(false)
      }
    }

    fetchDream()
  }, [user, id, router, toast])

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const { error } = await supabase.from("dreams").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Dream deleted",
        description: "Your dream has been successfully deleted.",
      })

      router.push("/dashboard/dreams")
    } catch (error) {
      console.error("Error deleting dream:", error)
      toast({
        title: "Error",
        description: "Failed to delete dream. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-dream-purple" />
      </div>
    )
  }

  if (!dream) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Dream Not Found</h2>
          <p className="text-gray-300 mb-6">
            The dream you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button className="glass-button" onClick={() => router.push("/dashboard/dreams")}>
            Back to Dream Journal
          </Button>
        </div>
      </div>
    )
  }

  const interpretation = dream.interpretations && dream.interpretations.length > 0 ? dream.interpretations[0] : null

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-white hover:bg-white/10">
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back to Dreams
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="glass-card glow">
            <div className="p-6 pb-2">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold gradient-text">{dream.title}</h2>
                <div className="flex gap-2">
                  <Badge variant="default" className="bg-dream-purple">
                    {dream.clarity === "high"
                      ? "Vivid Dream"
                      : dream.clarity === "medium"
                        ? "Clear Dream"
                        : "Fuzzy Dream"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-red-500/20"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>
                  {new Date(dream.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="p-6">
              <Tabs defaultValue="dream">
                <TabsList className="mb-4 bg-dream-card-bg border border-dream-glass-border">
                  <TabsTrigger
                    value="dream"
                    className="data-[state=active]:bg-dream-purple data-[state=active]:text-white"
                  >
                    Dream Content
                  </TabsTrigger>
                  {interpretation && (
                    <>
                      <TabsTrigger
                        value="interpretation"
                        className="data-[state=active]:bg-dream-blue data-[state=active]:text-white"
                      >
                        Interpretation
                      </TabsTrigger>
                      <TabsTrigger
                        value="actions"
                        className="data-[state=active]:bg-dream-pink data-[state=active]:text-white"
                      >
                        Recommended Actions
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>

                <TabsContent value="dream" className="space-y-4">
                  <p className="text-gray-300 whitespace-pre-line">{dream.content}</p>

                  <div className="pt-4">
                    <h4 className="font-medium text-white mb-2">Emotions & Feelings</h4>
                    <div className="flex flex-wrap gap-2">
                      {dream.emotion && (
                        <Badge variant="outline" className="border-dream-glass-border bg-dream-card-bg">
                          {dream.emotion}
                        </Badge>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {interpretation && (
                  <>
                    <TabsContent value="interpretation">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <StarIcon className="h-5 w-5 text-dream-purple mr-2 mt-1 flex-shrink-0" />
                          <p className="text-gray-300 whitespace-pre-line">{interpretation.interpretation_text}</p>
                        </div>

                        {interpretation.symbols && interpretation.symbols.length > 0 && (
                          <div className="mt-6">
                            <h4 className="font-medium text-white mb-2">Key Symbols</h4>
                            <div className="space-y-2">
                              {interpretation.symbols.map((symbol, index) => (
                                <div key={index} className="glass-card p-3">
                                  <h5 className="font-medium text-dream-blue">{symbol.name}</h5>
                                  <p className="text-gray-300 text-sm">{symbol.meaning}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="actions">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <BrainIcon className="h-5 w-5 text-dream-blue mr-2 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-gray-300 mb-4">
                              Based on your dream, here are recommended actions to integrate these insights into your
                              waking life:
                            </p>
                            <ul className="space-y-2">
                              {interpretation.actions.map((action, index) => (
                                <li key={index} className="flex items-start">
                                  <div className="bg-dream-blue bg-opacity-20 p-1 rounded-full mr-2 mt-0.5">
                                    <div className="w-2 h-2 bg-dream-blue rounded-full"></div>
                                  </div>
                                  <span className="text-gray-300">{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </div>
          </div>
        </div>

        <div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6 gradient-text">Dream Analysis</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Dream Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  <DreamTypeBadge
                    type="Recurring"
                    active={
                      dream.content.toLowerCase().includes("again") || dream.content.toLowerCase().includes("recurring")
                    }
                  />
                  <DreamTypeBadge
                    type="Lucid"
                    active={
                      dream.content.toLowerCase().includes("aware") || dream.content.toLowerCase().includes("control")
                    }
                  />
                  <DreamTypeBadge
                    type="Nightmare"
                    active={
                      dream.content.toLowerCase().includes("scary") ||
                      dream.content.toLowerCase().includes("fear") ||
                      dream.content.toLowerCase().includes("terrif")
                    }
                  />
                  <DreamTypeBadge
                    type="Healing"
                    active={
                      dream.content.toLowerCase().includes("peace") ||
                      dream.content.toLowerCase().includes("calm") ||
                      dream.content.toLowerCase().includes("resolve")
                    }
                  />
                </div>
              </div>

              {interpretation && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Connected Life Areas</h4>
                  <div className="space-y-2">
                    <LifeAreaItem
                      area="Personal Growth"
                      relevance={
                        interpretation.interpretation_text.toLowerCase().includes("growth") ||
                        interpretation.interpretation_text.toLowerCase().includes("develop")
                          ? "High"
                          : "Medium"
                      }
                    />
                    <LifeAreaItem
                      area="Relationships"
                      relevance={
                        interpretation.interpretation_text.toLowerCase().includes("relationship") ||
                        interpretation.interpretation_text.toLowerCase().includes("connect")
                          ? "High"
                          : "Low"
                      }
                    />
                    <LifeAreaItem
                      area="Career & Goals"
                      relevance={
                        interpretation.interpretation_text.toLowerCase().includes("career") ||
                        interpretation.interpretation_text.toLowerCase().includes("goal") ||
                        interpretation.interpretation_text.toLowerCase().includes("ambition")
                          ? "High"
                          : "Low"
                      }
                    />
                    <LifeAreaItem area="Emotional Well-being" relevance="High" />
                  </div>
                </div>
              )}

              <div>
                <Button className="glass-button-primary w-full" onClick={() => router.push("/dashboard/interpret")}>
                  Record Another Dream
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-dream-dark-blue border border-dream-glass-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              This will permanently delete this dream and its interpretation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="glass-button">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function DreamTypeBadge({ type, active }) {
  return (
    <div
      className={`
      text-sm rounded-md px-2 py-1 text-center
      ${
        active
          ? "bg-dream-purple/20 text-white border border-dream-purple/30"
          : "bg-dream-card-bg text-gray-400 border border-dream-glass-border"
      }
    `}
    >
      {type}
    </div>
  )
}

function LifeAreaItem({ area, relevance }) {
  const getBadgeColor = (rel) => {
    switch (rel) {
      case "High":
        return "bg-dream-purple/20 text-white border border-dream-purple/30"
      case "Medium":
        return "bg-dream-blue/20 text-white border border-dream-blue/30"
      case "Low":
        return "bg-dream-card-bg text-gray-400 border border-dream-glass-border"
      default:
        return "bg-dream-card-bg text-gray-400 border border-dream-glass-border"
    }
  }

  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-300">{area}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor(relevance)}`}>{relevance}</span>
    </div>
  )
}
