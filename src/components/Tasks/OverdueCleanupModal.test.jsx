// src/components/Tasks/OverdueCleanupModal.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OverdueCleanupModal from './OverdueCleanupModal';

const mockTasks = [
  { title: 'Pay invoice', dueDate: '2026-07-01' },
  { title: 'Update portfolio', dueDate: '2026-07-10' },
];

describe('OverdueCleanupModal', () => {
  it('renders nothing when there are no tasks', () => {
    const { container } = render(
      <OverdueCleanupModal
        tasks={[]}
        onComplete={() => {}}
        onMoveToToday={() => {}}
        onSkip={() => {}}
        onClose={() => {}}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the first task and correct task count', () => {
    render(
      <OverdueCleanupModal
        tasks={mockTasks}
        onComplete={() => {}}
        onMoveToToday={() => {}}
        onSkip={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('Pay invoice')).toBeInTheDocument();
    expect(screen.getByText('Task 1 of 2')).toBeInTheDocument();
  });

  it('shows date options when "Mark Complete..." is clicked', () => {
    render(
      <OverdueCleanupModal
        tasks={mockTasks}
        onComplete={() => {}}
        onMoveToToday={() => {}}
        onSkip={() => {}}
        onClose={() => {}}
      />
    );
    fireEvent.click(screen.getByText('✓ Mark Complete...'));
    expect(screen.getByText(/Which day should count this energy?/i)).toBeInTheDocument();
  });

  it('calls onMoveToToday and advances to the next task', async () => {
    const onMoveToToday = vi.fn().mockResolvedValue();
    render(
      <OverdueCleanupModal
        tasks={mockTasks}
        onComplete={() => {}}
        onMoveToToday={onMoveToToday}
        onSkip={() => {}}
        onClose={() => {}}
      />
    );
    fireEvent.click(screen.getByText('➔ Move to Today'));
    expect(onMoveToToday).toHaveBeenCalledWith(mockTasks[0]);
    expect(await screen.findByText('Update portfolio')).toBeInTheDocument();
  });

  it('calls onClose after the last task is skipped', () => {
    const onClose = vi.fn();
    const onSkip = vi.fn();
    render(
      <OverdueCleanupModal
        tasks={[mockTasks[1]]}
        onComplete={() => {}}
        onMoveToToday={() => {}}
        onSkip={onSkip}
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByText('Leave Overdue / Skip'));
    expect(onSkip).toHaveBeenCalledWith(mockTasks[1]);
    expect(onClose).toHaveBeenCalled();
  });
});