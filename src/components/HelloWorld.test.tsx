import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import HelloWorld from './HelloWorld';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('HelloWorld', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));
    
    render(<HelloWorld />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays hello world message when API call succeeds', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { message: 'Hello World' }
    });

    render(<HelloWorld />);

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    expect(screen.getByText('Successfully connected to Rails API!')).toBeInTheDocument();
  });

  it('displays error message when API call fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(<HelloWorld />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch message from API')).toBeInTheDocument();
    });
  });

  it('calls the correct API endpoint', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { message: 'Hello World' }
    });

    render(<HelloWorld />);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/hello')
      );
    });
  });
});

