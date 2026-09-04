import { useState } from "react"
import { MenuCourse } from "../types"
import { inp } from "../utils"
import { menuApi } from "../api"

interface Props {
  courses: MenuCourse[]
  onChange: (c: MenuCourse[]) => void
  weddingId?: string
}

const MEAL_STYLE = {
  veg: { bg: "#DCFCE7", text: "#166534", dot: "#16A34A", label: "Veg" },
  nonveg: { bg: "#FEE2E2", text: "#B91C1C", dot: "#DC2626", label: "Non-Veg" },
  both: { bg: "#FEF0D7", text: "#92400E", dot: "#D4900A", label: "Veg + Non-Veg" },
}

export default function Menu({ courses, onChange, weddingId }: Props) {
  const [newItem, setNewItem] = useState<Record<string, string>>({})
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [newCourseName, setNewCourseName] = useState("")
  const [newCourseHindi, setNewCourseHindi] = useState("")
  const [newCourseMeal, setNewCourseMeal] = useState<"veg" | "nonveg" | "both">("veg")
  const [loading, setLoading] = useState(false)

  const addCourse = async () => {
    if (!newCourseName.trim()) return
    setLoading(true)
    const payload = {
      name: newCourseName,
      hindiName: newCourseHindi,
      mealType: newCourseMeal,
      items: [],
    }

    if (weddingId) {
      const res = await menuApi.createCourse(weddingId, payload)
      if (res.success && res.data?.course) {
        onChange([...courses, res.data.course])
      }
    } else {
      onChange([...courses, { ...payload, id: Math.random().toString(36).substring(2, 9) }])
    }
    setNewCourseName("")
    setNewCourseHindi("")
    setShowAddCourse(false)
    setLoading(false)
  }

  const removeCourse = async (id: string) => {
    if (weddingId) {
      await menuApi.deleteCourse(weddingId, id)
    }
    onChange(courses.filter((c) => c.id !== id))
  }

  const addItemToCourse = async (courseId: string) => {
    const val = (newItem[courseId] || "").trim()
    if (!val) return

    const course = courses.find((c) => c.id === courseId)
    if (!course) return

    const updatedItems = [...course.items, val]
    const updatedCourses = courses.map((c) => (c.id === courseId ? { ...c, items: updatedItems } : c))
    onChange(updatedCourses)
    setNewItem((p) => ({ ...p, [courseId]: "" }))

    if (weddingId) {
      await menuApi.updateCourse(weddingId, courseId, { ...course, items: updatedItems })
    }
  }

  const removeItemFromCourse = async (courseId: string, item: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (!course) return

    const updatedItems = course.items.filter((i) => i !== item)
    const updatedCourses = courses.map((c) => (c.id === courseId ? { ...c, items: updatedItems } : c))
    onChange(updatedCourses)

    if (weddingId) {
      await menuApi.updateCourse(weddingId, courseId, { ...course, items: updatedItems })
    }
  }

  const updateCourseMeal = async (id: string, mealType: MenuCourse["mealType"]) => {
    const course = courses.find((c) => c.id === id)
    if (!course) return

    const updatedCourses = courses.map((c) => (c.id === id ? { ...c, mealType } : c))
    onChange(updatedCourses)

    if (weddingId) {
      await menuApi.updateCourse(weddingId, id, { ...course, mealType })
    }
  }

  const totalItems = courses.reduce((s, c) => s + c.items.length, 0)
  const vegItems = courses.filter((c) => c.mealType !== "nonveg").reduce((s, c) => s + c.items.length, 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Courses", value: courses.length, color: "#8B1D3B" },
          { label: "Total Items", value: totalItems, color: "#D4900A" },
          { label: "Veg / Mixed", value: vegItems, color: "#166534" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E8D5B7] p-4 text-center shadow-sm">
            <div className="font-playfair text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#9B8B7A] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add course */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-xl font-bold text-[#8B1D3B]">मेनू / Wedding Menu</h2>
          <p className="text-xs text-[#9B8B7A] mt-0.5">Plan your catering courses and dishes</p>
        </div>
        <button
          onClick={() => setShowAddCourse((p) => !p)}
          className="bg-[#8B1D3B] hover:bg-[#6B1530] text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
        >
          + Add Course
        </button>
      </div>

      {showAddCourse && (
        <div className="bg-white rounded-2xl border border-[#E8D5B7] p-5 shadow-sm">
          <h3 className="font-playfair font-bold text-[#8B1D3B] mb-4">New Course</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Course Name *</label>
              <input type="text" value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} placeholder="e.g. Starters" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Hindi Name</label>
              <input type="text" value={newCourseHindi} onChange={(e) => setNewCourseHindi(e.target.value)} placeholder="e.g. स्टार्टर" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B5744] mb-1">Meal Type</label>
              <select value={newCourseMeal} onChange={(e) => setNewCourseMeal(e.target.value as typeof newCourseMeal)} className={inp}>
                <option value="veg">🟢 Veg</option>
                <option value="nonveg">🔴 Non-Veg</option>
                <option value="both">🟡 Veg + Non-Veg</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={addCourse} disabled={!newCourseName.trim() || loading} className="bg-[#8B1D3B] hover:bg-[#6B1530] disabled:opacity-40 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors">
              {loading ? "Adding..." : "Add"}
            </button>
            <button onClick={() => setShowAddCourse(false)} className="bg-[#F0E6D3] hover:bg-[#E8D5B7] text-[#6B5744] font-medium px-5 py-2 rounded-lg text-sm transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Course cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => {
          const ms = MEAL_STYLE[course.mealType] || MEAL_STYLE.veg
          return (
            <div key={course.id} className="bg-white rounded-2xl border border-[#E8D5B7] overflow-hidden hover:border-[#D4900A]/40 transition-colors shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0E6D3]">
                <div>
                  <div className="font-playfair font-bold text-[#2C1810]">{course.name}</div>
                  <div className="text-xs text-[#9B8B7A]">{course.hindiName}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: ms.bg, color: ms.text }}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: ms.dot }} />
                    {ms.label}
                  </span>
                  <select
                    value={course.mealType}
                    onChange={(e) => updateCourseMeal(course.id, e.target.value as MenuCourse["mealType"])}
                    className="border border-[#E8D5B7] rounded px-1 py-0.5 text-xs bg-[#FFFBF5] text-[#6B5744] focus:outline-none"
                  >
                    <option value="veg">Veg</option>
                    <option value="nonveg">Non-Veg</option>
                    <option value="both">Both</option>
                  </select>
                  <button onClick={() => removeCourse(course.id)} className="text-[#C4A882] hover:text-red-500 transition-colors text-xl leading-none">×</button>
                </div>
              </div>
              <div className="p-4">
                {/* Items */}
                {course.items.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {course.items.map((item) => (
                      <span
                        key={item}
                        className="flex items-center gap-1 bg-[#FEF0D7] text-[#6B5744] text-xs px-2.5 py-1 rounded-full group"
                      >
                        {item}
                        <button
                          onClick={() => removeItemFromCourse(course.id, item)}
                          className="text-[#C4A882] hover:text-red-500 transition-colors leading-none ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {/* Add item */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItem[course.id] || ""}
                    onChange={(e) => setNewItem((p) => ({ ...p, [course.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && addItemToCourse(course.id)}
                    placeholder="Add dish name..."
                    className="flex-1 border border-[#E8D5B7] rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#8B1D3B] bg-[#FFFBF5] placeholder:text-[#C4A882]"
                  />
                  <button
                    onClick={() => addItemToCourse(course.id)}
                    disabled={!(newItem[course.id] || "").trim()}
                    className="bg-[#8B1D3B] hover:bg-[#6B1530] disabled:opacity-40 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-20 text-[#C4A882]">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-sm font-medium">No menu courses added yet.</p>
          <p className="text-xs mt-1">Start building your wedding feast!</p>
        </div>
      )}
    </div>
  )
}
