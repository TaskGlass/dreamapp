"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ChevronRightIcon, MoonIcon, StarIcon, SearchIcon, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

export default function DreamJournalPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [dreams, setDreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedDream, setExpandedDream] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredDreams, setFilteredDreams] = useState([])

  useEffect(() => {
    if (!user) return

    const fetchDreams = async () => {
      try {
        const { data, error } = await supabase
          .from("dreams")
          .select(`
            *,
            interpretations (*)
          `)
          .eq("user_id", user.id)
          .order("date", { ascending: false })

        if (error) throw error

        setDreams(data || [])
        setFilteredDreams(data || [])
      } catch (error) {
        console.error("Error fetching dreams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDreams()
  }, [user])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDreams(dreams)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = dreams.filter(
      (dream) =>
        dream.title.toLowerCase().includes(query) ||
        dream.content.toLowerCase().includes(query) ||
        dream.emotion.toLowerCase().includes(query),
    )

    setFilteredDreams(filtered)
  }, [searchQuery, dreams])

  const toggleDreamExpansion = (id) => {
    setExpandedDream(expandedDream === id ? null : id)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-dream-purple" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Your Dream Journal</h1>
          <p className="text-gray-400">Record and explore your dream experiences</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search dreams..."
              className="glass-input pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            className="glass-button-primary whitespace-nowrap"
            onClick={() => router.push("/dashboard/interpret")}
          >
            <MoonIcon className="mr-2 h-4 w-4" />
            New Dream
          </Button>
        </div>
      </div>

      {filteredDreams.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <MoonIcon className="h-12 w-12 text-dream-purple mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Dreams Found</h2>
          <p className="text-gray-300 mb-6">
            {dreams.length === 0
              ? "You haven't recorded any dreams yet. Start by adding your first dream."
              : "No dreams match your search criteria. Try a different search term."}
          </p>
          {dreams.length === 0 && (
            <Button className="glass-button-primary" onClick={() => router.push("/dashboard/interpret")}>
              Record Your First Dream
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredDreams.map((dream) => (
            <div key={dream.id} className={`glass-card glass-card-hover ${expandedDream === dream.id ? "glow" : ""}`}>
              <div className="p-6 pb-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold gradient-text">{dream.title}</h3>
                  <Badge variant={dream.clarity === "high" ? "default" : "outline"} className="bg-dream-purple">
                    {dream.clarity === "high" ? "Vivid" : dream.clarity === "medium" ? "Clear" : "Fuzzy"}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{formatDistanceToNow(new Date(dream.date), { addSuffix: true })}</span>
                </div>
              </div>

              <div className="px-6 py-4">
                <p className="text-gray-300 line-clamp-3">{dream.content}</p>

                {expandedDream === dream.id && dream.interpretations && dream.interpretations.length > 0 && (
                  <div className="mt-6 space-y-6 pt-4 border-t border-dream-glass-border">
                    <div>
                      <h4 className="font-semibold flex items-center text-dream-purple">
                        <StarIcon className="h-4 w-4 mr-2" /> Interpretation
                      </h4>
                      <p className="mt-2 text-gray-300">{dream.interpretations[0].interpretation_text}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold flex items-center text-dream-blue">
                        <MoonIcon className="h-4 w-4 mr-2" /> Recommended Actions
                      </h4>
                      <ul className="mt-2 space-y-2 text-gray-300">
                        {dream.interpretations[0].actions.map((action, index) => (
                          <li key={index} className="flex items-start">
                            <div className="bg-dream-blue bg-opacity-20 p-1 rounded-full mr-2 mt-0.5">
                              <div className="w-1.5 h-1.5 bg-dream-blue rounded-full"></div>
                            </div>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {dream.emotion && (
                        <Badge variant="outline" className="border-dream-glass-border bg-dream-card-bg">
                          {dream.emotion}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-dream-glass-border flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => toggleDreamExpansion(dream.id)}
                  className="text-dream-purple hover:text-white hover:bg-dream-purple/20"
                >
                  {expandedDream === dream.id ? "Show Less" : "Show More"}
                  <ChevronRightIcon
                    className={`ml-1 h-4 w-4 transition-transform ${expandedDream === dream.id ? "rotate-90" : ""}`}
                  />
                </Button>

                <Button
                  variant="ghost"
                  className="text-dream-blue hover:text-white hover:bg-dream-blue/20"
                  onClick={() => router.push(`/dashboard/dreams/${dream.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
