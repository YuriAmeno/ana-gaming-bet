
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { SportCategory } from "@/types"
import { useFavorites } from "@/contexts/FavoritesContext"

interface DraggableFavoritesProps {
  categories: SportCategory[]
}

export default function DraggableFavorites({ categories }: DraggableFavoritesProps) {
  const { favoriteCategories, toggleFavorite } = useFavorites()
  const [orderedFavorites, setOrderedFavorites] = useState(favoriteCategories)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
  useEffect(() => {
    setOrderedFavorites(favoriteCategories)
  }, [favoriteCategories])

  const favoriteCategs = categories.filter((cat) => favoriteCategories.includes(cat.id))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setOrderedFavorites((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over?.id as string)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  if (favoriteCategs.length === 0) {
    return (
      <motion.div
        className="text-center py-8 text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-4xl mb-4">🌟</div>
        <p>Adicione categorias aos favoritos para organizá-las aqui!</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        🎯 Categorias Favoritas
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {favoriteCategs.length}
        </span>
      </h3>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedFavorites} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {orderedFavorites.map((categoryId) => {
              const category = categories.find((cat) => cat.id === categoryId)
              return category ? (
                <SortableFavoriteItem
                  key={category.id}
                  category={category}
                  onRemove={() => toggleFavorite(category.id)}
                />
              ) : null
            })}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-4 pt-4 border-t text-xs text-gray-500 text-center">
        💡 Arraste para reordenar suas categorias favoritas
      </div>
    </motion.div>
  )
}

function SortableFavoriteItem({
  category,
  onRemove,
}: {
  category: SportCategory
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg border transition-all ${
        isDragging ? "shadow-lg scale-105 bg-blue-50 border-blue-200" : "hover:bg-gray-100"
      }`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ⋮⋮
        </motion.div>
        <span className="text-2xl">{category.icon || "🏅"}</span>
        <span className="font-medium text-gray-700">{category.name}</span>
      </div>

      <motion.button
        onClick={onRemove}
        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ✕
      </motion.button>
    </motion.div>
  )
}
