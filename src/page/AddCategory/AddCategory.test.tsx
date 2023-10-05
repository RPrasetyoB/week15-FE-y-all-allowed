import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import AddCategory from'./';
import { BrowserRouter } from 'react-router-dom';

global.fetch = jest.fn().mockResolvedValue({
  json: async () => ({ token: 'mockedToken'})
});

describe('test add category form', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
      })),
    });
  });  
    test('Add category Title render correctly', async () => {
        render(
            <BrowserRouter>
              <AddCategory />
            </BrowserRouter>
          );
        expect(screen.getByText('Add Category')).toBeDefined();
    })

    test('labels category render correctly', async () => {
        render(
            <BrowserRouter>
              <AddCategory />
            </BrowserRouter>
          );
        expect(screen.getByText('Category')).toBeDefined();
        expect(screen.getByText('Status')).toBeDefined();
    })

    test('Buttons render correctly', async () => {
        render(
            <BrowserRouter>
              <AddCategory />
            </BrowserRouter>
          );
          expect(screen.getByText('Add')).toBeDefined();
          expect(screen.getByText('Cancel')).toBeDefined();
    })

  test('submits the form and set token in localStorage', async () => {   
      render(<BrowserRouter>
              <AddCategory />
            </BrowserRouter>)
      const category = screen.getByPlaceholderText('Enter new category');
      const status = screen.getByPlaceholderText('Choose status');
      const button = screen.getByText('Add');

      act(() => {
          fireEvent.change(category, { target: { value : 'test'}});
          fireEvent.change(status, { target: { value : 'true'}});
          fireEvent.click(button);
      })

      await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith('https://mock-api.arikmpt.com/api/category', expect.any(Object));
      })
    })
})