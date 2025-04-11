"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ChevronRightIcon, MoonIcon, StarIcon, HeartIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

// Mock data for demonstration
const mockDreams = [
  {
    id: 1,
    title: "Flying Over Mountains",
    date: "2023-05-15",
    content:
      "I was flying over snow-capped mountains, feeling completely free and exhilarated. The air was crisp and I could see for miles in every direction.",
    interpretation:
      "Flying dreams often represent a desire for freedom or escape from current pressures. The mountains suggest you're facing challenges but have the perspective to overcome them.",
    actions: ["Practice meditation focused on freedom", "Consider what aspects of life feel constraining"],
    healing: "Your subconscious is processing feelings of limitation and showing you your potential for transcendence.",
    emotions: ["Freedom", "Joy"],
    clarity: "high",
  },
  {
    id: 2,
    title: "Lost in a Maze",
    date: "2023-05-10",
    content:
      "I was wandering through an endless maze with walls that kept shifting. I felt confused but not scared, as if I knew there was a solution if I kept trying.",
    interpretation:
      "Maze dreams typically reflect feeling confused about a decision or path in life. The shifting walls suggest changing circumstances that require adaptability.",
    actions: ["Map out current life challenges", "Practice decision-making exercises"],
    healing: "Your mind is working through complexity and developing problem-solving resilience.",
    emotions: ["Confusion", "Curiosity"],
    clarity: "medium",
  },
  {
    id: 3,
    title: "Underwater City",
    date: "2023-05-03",
    content:
      "I discovered a beautiful city beneath the ocean where people lived in harmony with sea creatures. I could breathe underwater and felt a sense of belonging.",
    interpretation:
      "Underwater environments often represent exploring your emotional depths or unconscious mind. The harmonious city suggests emotional integration and balance.",
    actions: ["Journal about emotional harmony", "Explore creative expression through art"],
    healing: "Your subconscious is revealing your capacity for emotional depth and connection with others.",
    emotions: ["Wonder", "Belonging"],
    clarity: "high",
  },
]

export default function DreamList() {
  const [expandedDream, setExpandedDream] = useState(null)

  const toggleDreamExpansion = (id) => {
    setExpandedDream(expandedDream === id ? null : id)
  }

  return (
    <div className="space-y-6">
      {mockDreams.map((dream) => (
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

            {expandedDream === dream.id && (
              <div className="mt-6 space-y-6 pt-4 border-t border-dream-glass-border">
                <div>
                  <h4 className="font-semibold flex items-center text-dream-purple">
                    <StarIcon className="h-4 w-4 mr-2" /> Interpretation
                  </h4>
                  <p className="mt-2 text-gray-300">{dream.interpretation}</p>
                </div>

                <div>
                  <h4 className="font-semibold flex items-center text-dream-pink">
                    <HeartIcon className="h-4 w-4 mr-2" /> Healing Insights
                  </h4>
                  <p className="mt-2 text-gray-300">{dream.healing}</p>
                </div>

                <div>
                  <h4 className="font-semibold flex items-center text-dream-blue">
                    <MoonIcon className="h-4 w-4 mr-2" /> Recommended Actions
                  </h4>
                  <ul className="mt-2 space-y-2 text-gray-300">
                    {dream.actions.map((action, index) => (
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
                  {dream.emotions.map((emotion, index) => (
                    <Badge key={index} variant="outline" className="border-dream-glass-border bg-dream-card-bg">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-dream-glass-border">
            <Button
              variant="ghost"
              onClick={() => toggleDreamExpansion(dream.id)}
              className="ml-auto text-dream-purple hover:text-white hover:bg-dream-purple/20"
            >
              {expandedDream === dream.id ? "Show Less" : "Show More"}
              <ChevronRightIcon
                className={`ml-1 h-4 w-4 transition-transform ${expandedDream === dream.id ? "rotate-90" : ""}`}
              />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
