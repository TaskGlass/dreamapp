"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, SearchIcon, BookIcon, MoonIcon, FilterIcon, SortAscIcon, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

export default function DreamLibraryPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [dreams, setDreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredDreams, setFilteredDreams] = useState([])
  const [activeFilter, setActiveFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [selectedTags, setSelectedTags] = useState([])
  const [availableTags, setAvailableTags] = useState([])

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

        // Extract unique emotions as tags
        const tags = [...new Set(data.map((dream) => dream.emotion).filter(Boolean))]
        setAvailableTags(tags)
      } catch (error) {
        console.error("Error fetching dreams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDreams()
  }, [user])

  // Filter dreams based on search query, tags, and clarity
  useEffect(() => {
    if (dreams.length === 0) return

    let filtered = [...dreams]

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (dream) =>
          dream.title.toLowerCase().includes(query) ||
          dream.content.toLowerCase().includes(query) ||
          (dream.emotion && dream.emotion.toLowerCase().includes(query)),
      )
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((dream) => dream.emotion && selectedTags.includes(dream.emotion))
    }

    // Apply clarity filter
    if (activeFilter !== "all") {
      filtered = filtered.filter((dream) => dream.clarity === activeFilter)
    }

    // Apply sort
    if (sortOrder === "newest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortOrder === "oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortOrder === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    setFilteredDreams(filtered)
  }, [dreams, searchQuery, activeFilter, sortOrder, selectedTags])

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-dream-purple" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dream Library</h1>
          <p className="text-white">Explore and organize your dream collection</p>
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

      {/* Filters and sorting */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="text-white font-medium flex items-center">
              <FilterIcon className="h-4 w-4 mr-1" /> Filters:
            </span>
            <Button
              variant="outline"
              size="sm"
              className={`${activeFilter === "all" ? "bg-dream-purple/20 border-dream-purple" : "glass-button"}`}
              onClick={() => setActiveFilter("all")}
            >
              All Dreams
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${activeFilter === "high" ? "bg-dream-purple/20 border-dream-purple" : "glass-button"}`}
              onClick={() => setActiveFilter("high")}
            >
              Vivid
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${activeFilter === "medium" ? "bg-dream-purple/20 border-dream-purple" : "glass-button"}`}
              onClick={() => setActiveFilter("medium")}
            >
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`${activeFilter === "low" ? "bg-dream-purple/20 border-dream-purple" : "glass-button"}`}
              onClick={() => setActiveFilter("low")}
            >
              Fuzzy
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white font-medium flex items-center">
              <SortAscIcon className="h-4 w-4 mr-1" /> Sort:
            </span>
            <select
              className="glass-input py-1 px-2 text-sm rounded-md"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        {availableTags.length > 0 && (
          <div className="mt-4">
            <span className="text-white font-medium mb-2 block">Emotions:</span>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer ${selectedTags.includes(tag) ? "bg-dream-purple" : "bg-dream-card-bg border-dream-glass-border"}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-6 bg-dream-card-bg border border-dream-glass-border">
          <TabsTrigger value="grid" className="data-[state=active]:bg-dream-purple data-[state=active]:text-white">
            Grid View
          </TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-dream-blue data-[state=active]:text-white">
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-dream-pink data-[state=active]:text-white">
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          {filteredDreams.length === 0 ? (
            <EmptyState searchQuery={searchQuery} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDreams.map((dream) => (
                <DreamCard key={dream.id} dream={dream} onClick={() => router.push(`/dashboard/dreams/${dream.id}`)} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          {filteredDreams.length === 0 ? (
            <EmptyState searchQuery={searchQuery} />
          ) : (
            <div className="space-y-4">
              {filteredDreams.map((dream) => (
                <DreamListItem
                  key={dream.id}
                  dream={dream}
                  onClick={() => router.push(`/dashboard/dreams/${dream.id}`)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-4 gradient-text">Calendar View</h3>
            <p className="text-white">
              Calendar view is coming soon. This will allow you to visualize your dreams over time.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DreamCard({ dream, onClick }) {
  const clarityLabel = dream.clarity === "high" ? "Vivid" : dream.clarity === "medium" ? "Clear" : "Fuzzy"
  const clarityColor =
    dream.clarity === "high" ? "bg-dream-purple" : dream.clarity === "medium" ? "bg-dream-blue" : "bg-dream-pink"

  return (
    <div
      className="glass-card glass-card-hover p-6 cursor-pointer transition-all duration-300 hover:translate-y-[-5px]"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold gradient-text line-clamp-1">{dream.title}</h3>
        <Badge variant="default" className={clarityColor}>
          {clarityLabel}
        </Badge>
      </div>

      <div className="flex items-center text-sm text-white mb-3">
        <CalendarIcon className="h-3 w-3 mr-1" />
        <span>{formatDistanceToNow(new Date(dream.date), { addSuffix: true })}</span>
      </div>

      <p className="text-white line-clamp-3 mb-4">{dream.content}</p>

      {dream.emotion && (
        <Badge variant="outline" className="bg-dream-card-bg border-dream-glass-border">
          {dream.emotion}
        </Badge>
      )}

      <div className="mt-4 pt-4 border-t border-dream-glass-border flex justify-between items-center">
        <span className="text-xs text-white opacity-70">{new Date(dream.date).toLocaleDateString()}</span>
        <Button variant="ghost" size="sm" className="text-dream-purple hover:text-white hover:bg-dream-purple/20">
          View Details
        </Button>
      </div>
    </div>
  )
}

function DreamListItem({ dream, onClick }) {
  const clarityLabel = dream.clarity === "high" ? "Vivid" : dream.clarity === "medium" ? "Clear" : "Fuzzy"
  const clarityColor =
    dream.clarity === "high" ? "bg-dream-purple" : dream.clarity === "medium" ? "bg-dream-blue" : "bg-dream-pink"

  return (
    <div className="glass-card glass-card-hover p-4 cursor-pointer" onClick={onClick}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold gradient-text">{dream.title}</h3>
            <Badge variant="default" className={clarityColor}>
              {clarityLabel}
            </Badge>
            {dream.emotion && (
              <Badge variant="outline" className="bg-dream-card-bg border-dream-glass-border">
                {dream.emotion}
              </Badge>
            )}
          </div>
          <p className="text-white line-clamp-1 mt-1">{dream.content}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-white">
            <CalendarIcon className="h-3 w-3 inline mr-1" />
            {new Date(dream.date).toLocaleDateString()}
          </div>
          <Button variant="ghost" size="sm" className="text-dream-purple hover:text-white hover:bg-dream-purple/20">
            View
          </Button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ searchQuery }) {
  return (
    <div className="glass-card p-8 text-center">
      <BookIcon className="h-12 w-12 text-dream-purple mx-auto mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">No Dreams Found</h2>
      <p className="text-white mb-6">
        {searchQuery
          ? "No dreams match your search criteria. Try a different search term or filter."
          : "You haven't recorded any dreams yet. Start by adding your first dream."}
      </p>
      <Button className="glass-button-primary" onClick={() => router.push("/dashboard/interpret")}>
        Record Your First Dream
      </Button>
    </div>
  )
}
