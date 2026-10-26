import { useState, useMemo } from 'react';
import { FiPlus, FiMoon, FiSun } from 'react-icons/fi';
import styles from './Board.module.scss';
import { useTaskStore } from '../store/useTaskStore';
import Column from './Column';
import TaskFormModal from './TaskFormModal';
import type { Task } from '../types';
import { useEffect } from 'react';

const Board = () => {
  const {
    tasks,
    columns,
    addColumn,
    searchQuery,
    setSearchQuery,
    isDarkTheme,
    toggleTheme,
  } = useTaskStore();

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [defaultColumnId, setDefaultColumnId] = useState<string | undefined>();

  const filteredTaskIds = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return new Set(
      Object.values(tasks)
        .filter((task) => task.title.toLowerCase().includes(query))
        .map((task) => task.id)
    );
  }, [tasks, searchQuery]);

  const totalTasks = Object.keys(tasks).length;
  const doneColumn = columns.find((col) => col.title === 'Done');
  const doneTasks = doneColumn ? doneColumn.taskIds.length : 0;

  const handleAddColumn = () => {
    const title = newColumnTitle.trim();
    if (title) {
      addColumn(title);
      setNewColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddColumn();
    if (e.key === 'Escape') {
      setIsAddingColumn(false);
      setNewColumnTitle('');
    }
  };

  const handleAddTask = (columnId?: string) => {
    setDefaultColumnId(columnId);
    setIsAddingTask(true);
  };

  useEffect(() => {
  if (isDarkTheme) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
}, [isDarkTheme]);
  return (
    <div className={isDarkTheme ? 'dark-theme' : ''}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.headerTitle}>TaskFlow</h1>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.taskCounter}>
            Выполнено: {doneTasks} / {totalTasks}
          </span>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            title={isDarkTheme ? 'Светлая тема' : 'Тёмная тема'}
            aria-label={isDarkTheme ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
          >
            {isDarkTheme ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.searchWrapper}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск задач..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.board}>
        {columns.map((column) => {
          const columnTasks = column.taskIds
            .map((id) => tasks[id])
            .filter((task) => {
              if (!task) return false;
              if (filteredTaskIds === null) return true;
              return filteredTaskIds.has(task.id);
            });

          return (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks}
              onEditTask={(task) => setEditingTask(task)}
              onAddTask={handleAddTask}
            />
          );
        })}

        <div style={{ minWidth: '300px' }}>
          {isAddingColumn ? (
            <div
              style={{
                background: 'var(--column-bg, #f4f5f7)',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Название колонки"
                autoFocus
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border, #ccc)',
                  fontSize: '14px',
                  marginBottom: '8px',
                  boxSizing: 'border-box',
                  background: 'var(--card-bg, #fff)',
                  color: 'var(--text, #333)',
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleAddColumn}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--primary, #4a90e2)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Добавить
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingColumn(false);
                    setNewColumnTitle('');
                  }}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--card-bg, #fff)',
                    color: 'var(--text, #333)',
                    border: '1px solid var(--border, #ccc)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={styles.addColumnButton}
              onClick={() => setIsAddingColumn(true)}
              title="Добавить колонку"
              aria-label="Добавить колонку"
            >
              <FiPlus size={16} />
              Добавить колонку
            </button>
          )}
        </div>
      </div>

      {isAddingTask && (
        <TaskFormModal
          defaultColumnId={defaultColumnId}
          onClose={() => {
            setIsAddingTask(false);
            setDefaultColumnId(undefined);
          }}
        />
      )}

      {editingTask && (
        <TaskFormModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default Board;