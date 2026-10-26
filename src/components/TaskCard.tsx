import { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiEdit3, FiTrash2, FiClock, FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';
import styles from './TaskCard.module.scss';
import { useTaskStore } from '../store/useTaskStore';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const priorityIcons: Record<string, { icon: React.ReactNode; className: string }> = {
  low: { icon: <FiClock size={16} />, className: styles.priorityLow },
  medium: { icon: <FiAlertCircle size={16} />, className: styles.priorityMedium },
  high: { icon: <FiAlertTriangle size={16} />, className: styles.priorityHigh },
};

const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { columns, moveTaskLeft, moveTaskRight, deleteTask } = useTaskStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentIndex = columns.findIndex((col) => col.id === task.columnId);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === columns.length - 1;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.setData('fromColumnId', task.columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const priority = task.priority !== 'none' ? priorityIcons[task.priority] : null;

  return (
    <>
      <div className={styles.taskCard}>
        {priority && (
          <span className={`${styles.priorityBadge} ${priority.className}`} title={`Приоритет: ${task.priority}`}>
            {priority.icon}
          </span>
        )}
        <div className={styles.taskHeader}>
          <div className={styles.menuWrapper} ref={menuRef}>
            <span
              className={styles.dragIcon}
              draggable
              onDragStart={handleDragStart}
              title="Меню задачи"
              aria-label="Меню задачи"
              role="button"
              tabIndex={0}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsMenuOpen(!isMenuOpen);
                }
              }}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <FiMoreVertical size={18} />
            </span>
            {isMenuOpen && (
              <div className={styles.dropdownMenu}>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => {
                    onEdit(task);
                    setIsMenuOpen(false);
                  }}
                  title="Редактировать задачу"
                  aria-label="Редактировать задачу"
                >
                  <FiEdit3 size={14} />
                  Редактировать
                </button>
                <button
                  type="button"
                  className={styles.menuItemDanger}
                  onClick={() => {
                    deleteTask(task.id);
                    setIsMenuOpen(false);
                  }}
                  title="Удалить задачу"
                  aria-label="Удалить задачу"
                >
                  <FiTrash2 size={14} />
                  Удалить
                </button>
              </div>
            )}
          </div>
          <h4 className={styles.taskTitle}>{task.title}</h4>
        </div>
        <p className={styles.taskDescription}>{task.description}</p>

        <div className={styles.taskActions}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => onEdit(task)}
            title="Редактировать задачу"
            aria-label="Редактировать задачу"
          >
            <FiEdit3 size={14} />
          </button>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => deleteTask(task.id)}
            title="Удалить задачу"
            aria-label="Удалить задачу"
          >
            <FiTrash2 size={14} />
          </button>
          <button
            type="button"
            className={styles.actionButton}
            disabled={isFirst}
            onClick={() => moveTaskLeft(task.id)}
            title="Переместить влево"
            aria-label="Переместить влево"
          >
            ←
          </button>
          <button
            type="button"
            className={styles.actionButton}
            disabled={isLast}
            onClick={() => moveTaskRight(task.id)}
            title="Переместить вправо"
            aria-label="Переместить вправо"
          >
            →
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskCard;