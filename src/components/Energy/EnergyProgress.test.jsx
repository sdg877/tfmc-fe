import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EnergyProgress from './EnergyProgress';

describe('EnergyProgress', () => {
  const baseUser = {
    categories: [
      { name: 'focus', weight: 25 },
      { name: 'admin', weight: 20 },
    ],
  };

  it('shows 100% remaining when there are no tasks', () => {
    render(<EnergyProgress tasks={[]} dailyLimit={100} user={baseUser} />);
    expect(screen.getByText(/100% Remaining/i)).toBeInTheDocument();
  });

  it('reduces remaining battery when a task is completed today', () => {
    const today = new Date().toISOString();
    const tasks = [
      { category: 'focus', isCompleted: true, completedAt: today },
    ];
    render(<EnergyProgress tasks={tasks} dailyLimit={100} user={baseUser} />);
    // 100 - 25 = 75% remaining
    expect(screen.getByText(/75% Remaining/i)).toBeInTheDocument();
  });

  it('shows overload warning when total energy exceeds daily limit', () => {
    const today = new Date().toISOString();
    const tasks = [
      { category: 'focus', isCompleted: true, completedAt: today },
      { category: 'admin', isCompleted: false, isPlannedForToday: true },
      { category: 'focus', isCompleted: false, isPlannedForToday: true },
      { category: 'admin', isCompleted: false, isPlannedForToday: true },
      { category: 'focus', isCompleted: false, isPlannedForToday: true },
    ];
    render(<EnergyProgress tasks={tasks} dailyLimit={50} user={baseUser} />);
    expect(screen.getByText(/Overload/i)).toBeInTheDocument();
  });

  it('switches to progress-bar view mode correctly', () => {
    render(
      <EnergyProgress tasks={[]} dailyLimit={100} user={baseUser} viewMode="bar" />
    );
    expect(screen.getByText(/Progress Bar/i)).toBeInTheDocument();
    expect(screen.getByText(/0% Complete/i)).toBeInTheDocument();
  });
});