import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  defaultDropAnimationSideEffects,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: (status: Task['status']) => void;
  onTaskMove?: (taskId: string, newStatus: Task['status']) => void;
}

interface KanbanColumnProps {
  column: { title: string; status: Task['status']; color: string };
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: (status: Task['status']) => void;
}

function KanbanColumn({ column, tasks, onTaskClick, onAddTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.status,
  });

  return (
    <div className="flex flex-col h-full min-w-[280px]">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center space-x-2">
          <div className={`h-2.5 w-2.5 rounded-full ${column.color.replace('100', '500')}`} />
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{column.title}</h3>
          <span className="ml-2 px-2 py-0.5 rounded-lg bg-gray-100 text-[10px] font-bold text-gray-500">
            {tasks.length}
          </span>
        </div>
        <button 
          onClick={() => onAddTask?.(column.status)}
          className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <SortableContext 
        id={column.status}
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div 
          ref={setNodeRef}
          className={`flex-1 rounded-3xl p-3 space-y-4 transition-all duration-200 ${
            isOver ? 'bg-gray-200/50 scale-[1.01]' : column.color + '/30'
          } min-h-[200px] border-2 border-dashed ${
            isOver ? 'border-blue-400' : 'border-transparent'
          } hover:border-gray-200`}
        >
          {tasks.map((task) => (
            <TaskCard 
              key={task.id}
              task={task} 
              onClick={() => onTaskClick?.(task)} 
            />
          ))}
          
          {tasks.length === 0 && !isOver && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Sin tareas</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

const columns: { title: string; status: Task['status']; color: string }[] = [
  { title: 'Pendientes', status: 'pending', color: 'bg-gray-100' },
  { title: 'En Progreso', status: 'in_progress', color: 'bg-blue-100' },
  { title: 'Completadas', status: 'done', color: 'bg-green-100' },
  { title: 'Bloqueadas', status: 'blocked', color: 'bg-red-100' },
];

export function KanbanBoard({ tasks: initialTasks, onTaskClick, onAddTask, onTaskMove }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTaskObj = tasks.find((t) => t.id === activeId);
    if (!activeTaskObj) return;

    const overTaskObj = tasks.find((t) => t.id === overId);
    const isOverAColumn = columns.some((col) => col.status === overId);

    if (overTaskObj) {
      if (activeTaskObj.status !== overTaskObj.status) {
        setTasks((prev) => {
          const activeIndex = prev.findIndex((t) => t.id === activeId);
          const overIndex = prev.findIndex((t) => t.id === overId);
          
          const updatedTasks = [...prev];
          updatedTasks[activeIndex] = { 
            ...updatedTasks[activeIndex], 
            status: overTaskObj.status 
          };
          
          return arrayMove(updatedTasks, activeIndex, overIndex);
        });
      } else {
        // Reordenamiento dentro de la misma columna
        setTasks((prev) => {
          const activeIndex = prev.findIndex((t) => t.id === activeId);
          const overIndex = prev.findIndex((t) => t.id === overId);
          return arrayMove(prev, activeIndex, overIndex);
        });
      }
    } else if (isOverAColumn) {
      if (activeTaskObj.status !== overId) {
        setTasks((prev) => {
          const activeIndex = prev.findIndex((t) => t.id === activeId);
          const updatedTasks = [...prev];
          updatedTasks[activeIndex] = { 
            ...updatedTasks[activeIndex], 
            status: overId as Task['status'] 
          };
          return updatedTasks;
        });
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      setTasks(initialTasks); // Reset a initial si se suelta fuera
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const task = tasks.find((t) => t.id === activeId);
    
    if (task) {
      // Si el estado cambió con respecto al inicial, actualizamos
      const originalTask = initialTasks.find(t => t.id === activeId);
      if (originalTask && originalTask.status !== task.status) {
        onTaskMove?.(activeId, task.status);
      }
    }

    setActiveTask(null);
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full min-h-[500px] overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            column={column}
            tasks={tasks.filter((t) => t.status === column.status)}
            onTaskClick={onTaskClick}
            onAddTask={onAddTask}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <div className="opacity-80 scale-105 transition-transform cursor-grabbing">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
