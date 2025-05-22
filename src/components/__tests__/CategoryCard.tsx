
import { render, screen, fireEvent } from '@testing-library/react';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import CategoryCard from '../CategoryCard';
import { SportCategory } from '@/types';
import { test, describe, expect, jest } from '@jest/globals';

const mockCategory: SportCategory = {
  id: 'soccer_test',
  name: 'Futebol Teste',
  icon: '⚽',
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(<FavoritesProvider>{component}</FavoritesProvider>);
};

describe('CategoryCard', () => {
  test('renderiza categoria corretamente', () => {
    renderWithProviders(<CategoryCard category={mockCategory} onClick={() => {}} index={0} />);

    expect(screen.getByText('Futebol Teste')).toBeDefined();
    expect(screen.getByText('⚽')).toBeDefined();
  });
  
  test('adiciona aos favoritos quando clica na estrela', () => {
    const mockOnClick = jest.fn();
    renderWithProviders(<CategoryCard category={mockCategory} onClick={mockOnClick} index={0} />);

    const favoriteButton = screen.getByLabelText(/adicionar aos favoritos/i);
    fireEvent.click(favoriteButton);

    expect(screen.getByText('⭐ Favorito')).toBeDefined();
  });

  test('chama onClick quando clica no card', () => {
    const mockOnClick = jest.fn();
    renderWithProviders(<CategoryCard category={mockCategory} onClick={mockOnClick} index={0} />);

    fireEvent.click(screen.getByText('Futebol Teste'));
    expect(mockOnClick).toHaveBeenCalledWith('soccer_test');
  });
});
