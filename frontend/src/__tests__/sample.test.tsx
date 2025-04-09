import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
function HelloWorld() {
  return <h1>Hello, world!</h1>;
}

test('renders hello world', () => {
  render(<HelloWorld />);
  expect(screen.getByText('Hello, world!')).toBeInTheDocument();
});