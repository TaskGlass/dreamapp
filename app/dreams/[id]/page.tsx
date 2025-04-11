"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon, CalendarIcon, BrainIcon, HeartIcon, StarIcon } from "lucide-react"

// Mock data for demonstration - in a real app, you would fetch this based on the ID
const dreamDetail = {
  id: 1,
  title: "Flying Over Mountains",
  date: "2023-05-15",
  content:
    "I was flying over snow-capped mountains, feeling completely free and exhilarated. The air was crisp and I could see for miles in every direction. Below me, I could see small villages nestled in valleys and winding rivers cutting through the landscape. At one point, I swooped down close to a mountain peak and could feel the cold air against my face. I wasn't afraid of falling at all, just enjoying the sensation of complete freedom. The dream had vibrant colors - the blue sky, white snow, and green forests were all incredibly vivid.",
  interpretation:
    "Flying dreams often represent a desire for freedom or escape from current pressures. The mountains suggest you're facing challenges but have the perspective to overcome them. The lack of fear indicates confidence in your abilities to rise above difficulties.\n\nThe vivid colors in your dream suggest emotional intensity and clarity about your desires. Blue skies represent optimism, white snow symbolizes purity of thought, and the green forests indicate growth and renewal.\n\nThis dream appears during a time when you may be feeling constrained in some aspect of your life, yet your subconscious is reminding you of your capacity to transcend limitations.",
  actions: [
    "Practice meditation focused on freedom and expansiveness",
    "Consider what aspects of life feel constraining and brainstorm solutions",
    "Spend time in nature, particularly in elevated places if possible",
    "Journal about times when you've successfully overcome obstacles",
    "Incorporate the color blue into your environment to maintain the feeling of openness",
  ],
  healing:
    "Your subconscious is processing feelings of limitation and showing you your potential for transcendence. This dream is healing by reminding you of your inner freedom, regardless of external circumstances.\n\nThe mountains in your dream represent challenges that may seem imposing, but your ability to fly over them reveals your inner knowledge that these obstacles are surmountable.\n\nThis dream is particularly healing for any anxiety or stress you may be experiencing, as it connects you with a sense of liberation and perspective that can be carried into your waking life.",
  emotions: ["Freedom", "Joy", "Exhilaration", "Confidence"],
  symbols: ["Flying", "Mountains", "Sky", "Snow", "Villages"],
  clarity: "high",
  recurrence: 3,
}

export default function DreamDetailPage({ params }) {
  const router = useRouter()
  const { id } = params

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
                <h2 className="text-2xl font-bold gradient-text">{dreamDetail.title}</h2>
                <Badge variant="default" className="bg-dream-purple">
                  {dreamDetail.clarity === "high"
                    ? "Vivid Dream"
                    : dreamDetail.clarity === "medium"
                      ? "Clear Dream"
                      : "Fuzzy Dream"}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-gray-400 mt-1">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>
                  {new Date(dreamDetail.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {dreamDetail.recurrence > 1 && (
                  <Badge variant="outline" className="ml-2 border-dream-glass-border bg-dream-card-bg">
                    Recurring ({dreamDetail.recurrence}x)
                  </Badge>
                )}
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
                  <TabsTrigger
                    value="interpretation"
                    className="data-[state=active]:bg-dream-blue data-[state=active]:text-white"
                  >
                    Interpretation
                  </TabsTrigger>
                  <TabsTrigger
                    value="healing"
                    className="data-[state=active]:bg-dream-pink data-[state=active]:text-white"
                  >
                    Healing Insights
                  </TabsTrigger>
                  <TabsTrigger
                    value="actions"
                    className="data-[state=active]:bg-dream-purple data-[state=active]:text-white"
                  >
                    Recommended Actions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dream" className="space-y-4">
                  <p className="text-gray-300 whitespace-pre-line">{dreamDetail.content}</p>

                  <div className="pt-4">
                    <h4 className="font-medium text-white mb-2">Emotions & Feelings</h4>
                    <div className="flex flex-wrap gap-2">
                      {dreamDetail.emotions.map((emotion, index) => (
                        <Badge key={index} variant="outline" className="border-dream-glass-border bg-dream-card-bg">
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="font-medium text-white mb-2">Key Symbols</h4>
                    <div className="flex flex-wrap gap-2">
                      {dreamDetail.symbols.map((symbol, index) => (
                        <Badge key={index} variant="outline" className="border-dream-glass-border bg-dream-card-bg">
                          {symbol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="interpretation">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <StarIcon className="h-5 w-5 text-dream-purple mr-2 mt-1 flex-shrink-0" />
                      <p className="text-gray-300 whitespace-pre-line">{dreamDetail.interpretation}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="healing">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <HeartIcon className="h-5 w-5 text-dream-pink mr-2 mt-1 flex-shrink-0" />
                      <p className="text-gray-300 whitespace-pre-line">{dreamDetail.healing}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <BrainIcon className="h-5 w-5 text-dream-blue mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-gray-300 mb-4">
                          Based on your dream, here are recommended actions to integrate these insights into your waking
                          life:
                        </p>
                        <ul className="space-y-2">
                          {dreamDetail.actions.map((action, index) => (
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
              </Tabs>
            </div>
          </div>
        </div>

        <div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold mb-6 gradient-text">Dream Analysis</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Psychological Elements</h4>
                <div className="space-y-3">
                  <AnalysisItem label="Self-Discovery" value={85} color="bg-dream-purple" />
                  <AnalysisItem label="Emotional Processing" value={70} color="bg-dream-blue" />
                  <AnalysisItem label="Subconscious Healing" value={90} color="bg-dream-pink" />
                  <AnalysisItem label="Problem Solving" value={65} color="bg-dream-purple" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Dream Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  <DreamTypeBadge type="Archetypal" active={true} />
                  <DreamTypeBadge type="Lucid" active={false} />
                  <DreamTypeBadge type="Recurring" active={true} />
                  <DreamTypeBadge type="Prophetic" active={false} />
                  <DreamTypeBadge type="Healing" active={true} />
                  <DreamTypeBadge type="Nightmare" active={false} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Connected Life Areas</h4>
                <div className="space-y-2">
                  <LifeAreaItem area="Personal Freedom" relevance="High" />
                  <LifeAreaItem area="Career & Ambition" relevance="Medium" />
                  <LifeAreaItem area="Emotional Well-being" relevance="High" />
                  <LifeAreaItem area="Relationships" relevance="Low" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalysisItem({ label, value, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm font-medium text-white">{value}%</span>
      </div>
      <div className="w-full bg-dream-card-bg rounded-full h-2 border border-dream-glass-border">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
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
