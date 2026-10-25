import React, { useState } from 'react';
import { RoadmapPhase, RoadmapTask, TaskPriority, TaskStatus } from '../../types/roadmap';
import { ROADMAP_PHASES } from '../../data/defaultRoadmap';
import {
  KanbanSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Filter,
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';

interface RoadmapViewProps {
  tasks: RoadmapTask[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (task: Omit<RoadmapTask, 'id'>) => void;
  onResetRoadmap: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  tasks,
  onUpdateTaskStatus,
  onAddTask,
  onResetRoadmap,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPhaseId, setNewPhaseId] = useState(1);
  const [newPriority, setNewPriority] = useState<TaskPriority>('High');
  const [newTimeline, setNewTimeline] = useState('Q3 2025');
  const [newMilestone, setNewMilestone] = useState('NIST FIPS 203 Compliance');
  const [newDeliverable, setNewDeliverable] = useState('');

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const overallProgress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const phase = ROADMAP_PHASES.find((p) => p.id === newPhaseId) || ROADMAP_PHASES[0];

    onAddTask({
      title: newTitle.trim(),
      description: newDescription.trim() || 'Custom organizational migration action item.',
      phaseId: phase.id,
      phaseName: phase.name,
      status: 'Pending',
      priority: newPriority,
      targetTimeline: newTimeline,
      estimatedWeeks: 4,
      nistMilestone: newMilestone,
      affectedComponents: ['Enterprise PKI', 'Core Infrastructure'],
      deliverable: newDeliverable || 'Audit documentation and verified test suite.',
      isCustom: true,
    });

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewDeliverable('');
    setIsModalOpen(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
              <KanbanSquare className="w-6 h-6 text-cyan-400" />
              <span>NIST Post-Quantum Migration Roadmap</span>
            </h1>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              {overallProgress}% Executed
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Prioritized 4-phase rollout plan aligning with NIST SP 800-131A, CNSA 2.0, and White House NSM-10 transition mandates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetRoadmap}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyber-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold shadow-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Task</span>
          </button>
        </div>
      </div>

      {/* Progress & Executive Timeline Ribbon */}
      <div className="cyber-card p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400 uppercase tracking-wider font-semibold">
            Overall Transformation Progress ({completedCount}/{tasks.length} Milestones)
          </span>
          <span className="text-cyan-400 font-bold">{overallProgress}% Complete</span>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-cyber-950 border border-slate-700 text-slate-300 rounded px-2.5 py-1 text-xs font-mono"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-cyber-950 border border-slate-700 text-slate-300 rounded px-2.5 py-1 text-xs font-mono"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <span className="text-slate-500">
            Showing {filteredTasks.length} task items
          </span>
        </div>
      </div>

      {/* 4 Phases Kanban / Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ROADMAP_PHASES.map((phase) => {
          const phaseTasks = filteredTasks.filter((t) => t.phaseId === phase.id);
          const phaseCompleted = phaseTasks.filter((t) => t.status === 'Completed').length;
          const phasePercent = phaseTasks.length > 0 ? Math.round((phaseCompleted / phaseTasks.length) * 100) : 0;

          return (
            <div key={phase.id} className="cyber-card rounded-2xl flex flex-col justify-between border border-slate-800 p-4">
              {/* Phase Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span
                      className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                      style={{
                        color: phase.color,
                        borderColor: `${phase.color}40`,
                        backgroundColor: `${phase.color}15`,
                      }}
                    >
                      {phase.badge}
                    </span>
                    <h3 className="font-mono font-bold text-sm text-white mt-1.5 line-clamp-1">
                      {phase.name}
                    </h3>
                  </div>

                  <span className="text-xs font-mono text-slate-400 font-semibold">
                    {phasePercent}%
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 mb-3 leading-relaxed">
                  {phase.description}
                </p>

                {/* Task Cards in this Phase */}
                <div className="space-y-3">
                  {phaseTasks.length === 0 ? (
                    <div className="p-4 text-center text-slate-600 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
                      No matching tasks in this phase.
                    </div>
                  ) : (
                    phaseTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl border transition-all text-xs font-mono space-y-2.5 ${
                          task.status === 'Completed'
                            ? 'bg-emerald-950/20 border-emerald-900/60 text-slate-300'
                            : task.status === 'In Progress'
                            ? 'bg-cyan-950/25 border-cyan-800/60 text-slate-200'
                            : 'bg-cyber-950 border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-white leading-tight">
                            {task.title}
                          </div>
                          <span
                            className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded shrink-0 ${
                              task.priority === 'Urgent'
                                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                                : task.priority === 'High'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-slate-900 text-slate-400'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                          {task.description}
                        </p>

                        <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                          <span>Target: {task.targetTimeline}</span>
                          <span className="text-cyan-400 font-semibold truncate max-w-[110px]">
                            {task.nistMilestone}
                          </span>
                        </div>

                        {/* Status Toggle Button */}
                        <div className="pt-1 flex items-center justify-between gap-1">
                          <span className="text-[10px] text-slate-500">Status:</span>
                          <select
                            value={task.status}
                            onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                            className={`text-[11px] font-mono rounded px-2 py-1 border focus:outline-none cursor-pointer ${
                              task.status === 'Completed'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : task.status === 'In Progress'
                                ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                                : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span>Timeline: {phase.timeframe}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Custom Task */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-cyber-950 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Add Custom Roadmap Task</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Audit Payment Gateway TLS 1.3 Cipher Suites"
                  className="w-full bg-[#05070E] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Specify migration scope, dependencies, and expected outcome..."
                  className="w-full bg-[#05070E] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Target Phase</label>
                  <select
                    value={newPhaseId}
                    onChange={(e) => setNewPhaseId(Number(e.target.value))}
                    className="w-full bg-[#05070E] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {ROADMAP_PHASES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.badge}: {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full bg-[#05070E] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Target Timeline</label>
                  <input
                    type="text"
                    value={newTimeline}
                    onChange={(e) => setNewTimeline(e.target.value)}
                    placeholder="Q4 2025"
                    className="w-full bg-[#05070E] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">NIST Milestone</label>
                  <input
                    type="text"
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    placeholder="NIST FIPS 204"
                    className="w-full bg-[#05070E] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
