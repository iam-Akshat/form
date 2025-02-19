import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormRenderer from '../FormRenderer';
import { mockStorage } from '../../../../storage';

// Mock the storage module
vi.mock('../../../../storage', () => ({
  mockStorage: {
    loadForm: vi.fn(),
  },
}));

// Mock the ShadcnFieldRenderer components
vi.mock('../FieldRenderer', () => ({
  ShadcnFieldRenderer: {
    renderFormField: ({ label, error, children }: any) => (
      <div>
        <label>{label}</label>
        {children}
        {error && <div role="alert">{error}</div>}
      </div>
    ),
    renderInput: ({ value, onChange, type, placeholder }: any) => (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    ),
    renderSelect: ({ value, onChange, options, placeholder }: any) => (
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      >
        <option value="">{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ),
  },
}));

describe('FormRenderer', () => {
  const onSubmit = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', async () => {
    vi.mocked(mockStorage.loadForm).mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading state
    );

    render(<FormRenderer onSubmit={onSubmit} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows error state when form loading fails', async () => {
    const errorMessage = 'Failed to load form configuration';
    vi.mocked(mockStorage.loadForm).mockRejectedValueOnce(new Error(errorMessage));

    render(<FormRenderer onSubmit={onSubmit} />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('renders form fields when configuration is loaded', async () => {
    const mockConfig = {
      fields: [
        {
          type: 'text',
          name: 'firstName',
          title: 'First Name',
          validation: {
            required: true,
          },
        },
        {
          type: 'select',
          name: 'country',
          title: 'Country',
          validation: {
            required: true,
            options: [
              { label: 'USA', value: 'usa' },
              { label: 'Canada', value: 'canada' },
            ],
          },
        },
      ],
    };

    vi.mocked(mockStorage.loadForm).mockResolvedValueOnce(mockConfig);

    render(<FormRenderer onSubmit={onSubmit} />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText('Enter first name')).toBeInTheDocument();
    expect(screen.getByLabelText('Select an option')).toBeInTheDocument();
  });
});
