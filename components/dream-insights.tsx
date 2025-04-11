"use client"

import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Mock data for demonstration
const emotionData = [
  { name: "Joy", value: 8 },
  { name: "Fear", value: 5 },
  { name: "Confusion", value: 4 },
  { name: "Wonder", value: 7 },
  { name: "Anxiety", value: 6 },
  { name: "Peace", value: 3 },
]

const themeData = [
  { name: "Flying", value: 5 },
  { name: "Water", value: 4 },
  { name: "Being Chased", value: 3 },
  { name: "Falling", value: 2 },
  { name: "Lost", value: 3 },
  { name: "Discovering", value: 4 },
]

const monthlyData = [
  { name: "Jan", dreams: 2 },
  { name: "Feb", dreams: 3 },
  { name: "Mar", dreams: 5 },
  { name: "Apr", dreams: 4 },
  { name: "May", dreams: 8 },
]

const COLORS = ["#8b5cf6", "#6366f1", "#ec4899", "#8b5cf6", "#6366f1", "#ec4899"]

const healingInsights = [
  {
    area: "Self-Awareness",
    progress: 75,
    insight: "Your dreams show increasing self-reflection and awareness of your emotional patterns.",
  },
  {
    area: "Stress Management",
    progress: 60,
    insight: "Your subconscious is processing daily stressors, but still shows signs of anxiety in some dream themes.",
  },
  {
    area: "Emotional Processing",
    progress: 85,
    insight:
      "You're effectively working through emotional experiences in your dreams, particularly related to past relationships.",
  },
  {
    area: "Creative Potential",
    progress: 90,
    insight: "Your dreams reveal significant creative energy and potential for innovative thinking.",
  },
]

export default function DreamInsights() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 gradient-text">Dream Frequency</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#131320",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "white",
                  }}
                />
                <Bar dataKey="dreams" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-4 gradient-text">Common Themes & Emotions</h3>
          <Tabs defaultValue="emotions">
            <TabsList className="mb-4 bg-dream-card-bg border border-dream-glass-border">
              <TabsTrigger
                value="emotions"
                className="data-[state=active]:bg-dream-purple data-[state=active]:text-white"
              >
                Emotions
              </TabsTrigger>
              <TabsTrigger value="themes" className="data-[state=active]:bg-dream-blue data-[state=active]:text-white">
                Themes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="emotions" className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#131320",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="themes" className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={themeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {themeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#131320",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-6 gradient-text">Subconscious Healing Progress</h3>
        <div className="space-y-6">
          {healingInsights.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">{item.area}</span>
                <span className="text-sm text-gray-400">{item.progress}%</span>
              </div>
              <Progress
                value={item.progress}
                className="h-2"
                indicatorClassName={index % 2 === 0 ? "bg-dream-purple" : "bg-dream-blue"}
              />
              <p className="text-sm text-gray-400">{item.insight}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-6 gradient-text">Recommended Actions for Growth</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-dream-purple">Daily Practices</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-dream-purple bg-opacity-20 p-1 rounded-full mr-2 mt-0.5">
                  <div className="w-2 h-2 bg-dream-purple rounded-full"></div>
                </div>
                <span className="text-gray-300">Journal about recurring dream symbols for 10 minutes each morning</span>
              </li>
              <li className="flex items-start">
                <div className="bg-dream-purple bg-opacity-20 p-1 rounded-full mr-2 mt-0.5">
                  <div className="w-2 h-2 bg-dream-purple rounded-full"></div>
                </div>
                <span className="text-gray-300">Practice 5 minutes of mindfulness meditation before sleep</span>
              </li>
              <li className="flex items-start">
                <div className="bg-dream-purple bg-opacity-20 p-1 rounded-full mr-2 mt-0.5">
                  <div className="w-2 h-2 bg-dream-purple rounded-full"></div>
                </div>
                <span className="text-gray-300">Set a positive intention for dreaming as you fall asleep</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-dream-blue">Weekly Reflections</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-dream-blue bg-opacity-20 p-1 rounded-full mr-2 mt-0.5">
                  <div className="w-2 h-2 bg-dream-blue rounded-full"></div>
                </div>
                <span className="text-gray-300">
                  Review your dream patterns and identify connections to waking life
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-dream-blue bg-opacity-20 p-1 rounded-full mr-2 mt-0.5">
                  <div className="w-2 h-2 bg-dream-blue rounded-full"></div>
                </div>
                <span className="text-gray-300">Create artwork based on a significant dream symbol</span>
              </li>
              <li className="flex items-start">
                <div className="bg-dream-blue bg-opacity-20 p-1 rounded-full mr-2 mt-0.5">
                  <div className="w-2 h-2 bg-dream-blue rounded-full"></div>
                </div>
                <span className="text-gray-300">Practice a guided meditation focused on subconscious healing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
