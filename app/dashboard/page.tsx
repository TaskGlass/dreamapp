"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, PlusIcon, BookIcon, BrainIcon, ListIcon } from "lucide-react"
import DreamEntryForm from "@/components/dream-entry-form"
import DreamList from "@/components/dream-list"
import DreamCalendar from "@/components/dream-calendar"
import DreamInsights from "@/components/dream-insights"

// Add StatCardProps type
interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

export default function Dashboard() {
  const [showDreamForm, setShowDreamForm] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Your Dream Journal</h1>
            <p className="text-gray-400">Track, interpret, and learn from your dreams</p>
          </div>
          <Button onClick={() => setShowDreamForm(true)} className="glass-button-primary">
            <PlusIcon className="mr-2 h-4 w-4" /> Record New Dream
          </Button>
        </div>

        {showDreamForm && (
          <div className="glass-card mb-8">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 gradient-text">Record Your Dream</h3>
              <p className="text-gray-400 mb-4">
                Capture the details of your dream while they're still fresh in your mind
              </p>
              <DreamEntryForm onComplete={() => setShowDreamForm(false)} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Dreams"
            value="24"
            description="Dreams recorded"
            icon={<BookIcon className="h-5 w-5 text-dream-purple" />}
          />
          <StatCard
            title="This Month"
            value="8"
            description="Dreams in May"
            icon={<CalendarIcon className="h-5 w-5 text-dream-blue" />}
          />
          <StatCard
            title="Common Theme"
            value="Flying"
            description="Most recurring theme"
            icon={<ListIcon className="h-5 w-5 text-dream-pink" />}
          />
          <StatCard
            title="Healing Progress"
            value="67%"
            description="Subconscious healing"
            icon={<BrainIcon className="h-5 w-5 text-dream-purple" />}
          />
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-6 bg-dream-card-bg border border-dream-glass-border">
            <TabsTrigger value="list" className="data-[state=active]:bg-dream-purple data-[state=active]:text-white">
              Dream List
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-dream-blue data-[state=active]:text-white">
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-dream-pink data-[state=active]:text-white">
              Insights & Patterns
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <DreamList />
          </TabsContent>
          <TabsContent value="calendar">
            <DreamCalendar />
          </TabsContent>
          <TabsContent value="insights">
            <DreamInsights />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="glass-card glass-card-hover p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1 gradient-text">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        </div>
        <div className="bg-dream-card-bg p-2 rounded-full border border-dream-glass-border">{icon}</div>
      </div>
    </div>
  )
}
