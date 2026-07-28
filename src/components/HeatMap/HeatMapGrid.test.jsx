import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeatMapGrid from './HeatMapGrid';

describe('HeatMapGrid', () => {
  it('renders the default heading and 28 days by default', () => {
    render(<HeatMapGrid data={{}} joinDate={null} user={null} />);
    expect(screen.getByText(/Your Wins/i)).toBeInTheDocument();
    expect(screen.getByText(/Last 4 weeks/i)).toBeInTheDocument();
  });

  it('shows the join date when one is provided', () => {
    const joinDate = '2026-01-15';
    render(<HeatMapGrid data={{}} joinDate={joinDate} user={null} />);
    expect(screen.getByText(/Joined:/i)).toBeInTheDocument();
  });

  it('shows the default hint text when no day is hovered', () => {
    render(<HeatMapGrid data={{}} joinDate={null} user={null} />);
    expect(screen.getByText(/Consistency is key!/i)).toBeInTheDocument();
  });
});