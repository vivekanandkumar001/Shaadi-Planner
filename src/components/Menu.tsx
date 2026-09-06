import { useState } from "react"
import { MenuCourse } from "../types"
import { menuApi } from "../api"

interface Props {
  courses: MenuCourse[]
  onChange: (c: MenuCourse[]) => void
  weddingId?: string
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

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* HEADER & ACTION */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#EAE0D5] pb-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-[#7A1631]">Wedding Menu Builder</h2>
          <p className="text-xs text-[#75676B] font-medium mt-0.5">Organize appetizers, live counters, main courses, and desserts with dietary tags</p>
        </div>
        <button
          onClick={() => setShowAddCourse((p) => !p)}
          className="luxury-button-primary font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
        >
          {showAddCourse ? "✕ Close Form" : "+ Add Menu Course"}
        </button>
      </div>

      {/* ADD COURSE FORM */}
      {showAddCourse && (
        <div className="luxury-card p-6 sm:p-8 space-y-6">
          <h3 className="font-playfair text-xl font-bold text-[#7A1631]">Create New Menu Course Section</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium">
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Course Name *</label>
              <input
                type="text"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="e.g. Royal Starters & Live Counters"
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Hindi Subtitle</label>
              <input
                type="text"
                value={newCourseHindi}
                onChange={(e) => setNewCourseHindi(e.target.value)}
                placeholder="e.g. स्टार्टर एवं चाट"
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
              />
            </div>
            <div>
              <label className="block text-[#1A1617] font-semibold mb-1.5">Dietary Classification *</label>
              <select
                value={newCourseMeal}
                onChange={(e) => setNewCourseMeal(e.target.value as any)}
                className="w-full border border-[#EAE0D5] rounded-xl px-4 py-2.5 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631] cursor-pointer"
              >
                <option value="veg">Vegetarian Only 🥦</option>
                <option value="nonveg">Non-Vegetarian 🍗</option>
                <option value="both">Veg + Non-Veg 🍱</option>
              </select>
            </div>
          </div>

          <div>
            <button
              onClick={addCourse}
              disabled={loading}
              className="luxury-button-primary font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
            >
              {loading ? "Adding..." : "Save Menu Course"}
            </button>
          </div>
        </div>
      )}

      {/* COURSES GRID */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="luxury-card p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-[#EAE0D5] pb-3">
                  <div>
                    <h3 className="font-playfair text-lg font-bold text-[#7A1631]">{course.name}</h3>
                    {course.hindiName && <p className="text-xs text-[#75676B] font-medium">{course.hindiName}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg border bg-[#FCF8F2] border-[#EAE0D5] text-[#7A1631] uppercase">
                      {course.mealType === "veg" ? "🥦 Pure Veg" : course.mealType === "nonveg" ? "🍗 Non-Veg" : "🍱 Mixed"}
                    </span>
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="text-rose-600 hover:text-rose-900 font-bold text-xs cursor-pointer px-2 py-1 bg-rose-50 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Dish Items List */}
                <div className="space-y-2">
                  {course.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FCF8F2] px-3.5 py-2 rounded-xl border border-[#EAE0D5] flex items-center justify-between text-xs font-medium text-[#1A1617]"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[#D4AF37]">✦</span>
                        <span>{item}</span>
                      </span>
                      <button
                        onClick={() => removeItemFromCourse(course.id, item)}
                        className="text-rose-600 font-bold hover:underline cursor-pointer text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {course.items.length === 0 && (
                    <div className="text-xs text-[#75676B] italic p-4 text-center bg-[#FCF8F2]/50 rounded-xl">
                      No dishes added to this course yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Add dish input */}
              <div className="pt-3 border-t border-[#EAE0D5] flex items-center gap-2">
                <input
                  type="text"
                  value={newItem[course.id] || ""}
                  onChange={(e) => setNewItem({ ...newItem, [course.id]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addItemToCourse(course.id)}
                  placeholder="Add dish (e.g. Paneer Tikka)..."
                  className="flex-1 text-xs border border-[#EAE0D5] rounded-xl px-3.5 py-2 bg-[#FCF8F2] text-[#1A1617] focus:outline-none focus:border-[#7A1631]"
                />
                <button
                  onClick={() => addItemToCourse(course.id)}
                  className="luxury-button-primary px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="luxury-card p-12 text-center text-[#75676B] space-y-3">
          <div className="text-4xl">🍽️</div>
          <p className="text-sm font-semibold">No menu courses created yet.</p>
          <p className="text-xs">Add starters, main courses, live food stalls, and desserts above.</p>
        </div>
      )}
    </div>
  )
}
