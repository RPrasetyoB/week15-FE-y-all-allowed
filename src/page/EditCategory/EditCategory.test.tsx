import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import EditCategory from'./';
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
    test('Edit category Title form render correctly', async () => {
      render(
          <BrowserRouter>
            <EditCategory />
          </BrowserRouter>
        );
      expect(screen.getByText('Edit Category')).toBeDefined();
    })

    test('labels Edit category render correctly', async () => {
      render(
          <BrowserRouter>
            <EditCategory />
          </BrowserRouter>
        );
      expect(screen.getByText('Category')).toBeDefined();
      expect(screen.getByText('Status')).toBeDefined();
    })

    test('buttons render correctly', async () => {
      render(
          <BrowserRouter>
            <EditCategory />
          </BrowserRouter>
        );
      expect(screen.getByText('Update')).toBeDefined();
      expect(screen.getByText('Cancel')).toBeDefined();
    })

  test('submits the form and set token in localStorage', async () => {   
      render(<BrowserRouter>
              <EditCategory />
            </BrowserRouter>)
      const category = screen.getByPlaceholderText('Enter update category');
      const status = screen.getByPlaceholderText('Choose status');
      const button = screen.getByText('Update');

      act(() => {
          fireEvent.change(category, { target: { value : 'test'}});
          fireEvent.change(status, { target: { value : 'true'}});
          fireEvent.click(button);
      })
      await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith('https://mock-api.arikmpt.com/api/category/update', expect.any(Object));
      })
    })
})