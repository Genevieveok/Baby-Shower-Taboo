import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Baby Shower Taboo heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Baby Shower Taboo/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders start game button', () => {
  render(<App />);
  const startButton = screen.getByText(/Start Game/i);
  expect(startButton).toBeInTheDocument();
})