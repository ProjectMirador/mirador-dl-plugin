import React from 'react';
import RenderingDownloadLink from '../src/RenderingDownloadLink';
import { render, screen } from './test-utils';

function createWrapper(props) {
  return render(
    <RenderingDownloadLink
      rendering={{}}
      {...props}
    />,
  );
}

describe('RenderingDownloadLink', () => {
  const rendering = {
    id: 'http://example.com/abc123.pdf',
    getLabel: () => ({ getValue: () => 'Link to the PDF' }),
    getFormat: () => ({ value: 'application/pdf' }),
  };

  it('renders a Link for the rendering', () => {
    createWrapper({ rendering });

    const link = screen.getByRole('link', { name: /Link to the PDF/i });
    expect(link).toBeInTheDocument();
  });

  it('links the label and includes the format (unlinked)', () => {
    createWrapper({ rendering });

    const link = screen.getByRole('link', { name: /Link to the PDF/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'http://example.com/abc123.pdf');
    const listItem = screen.getByText(/application\/pdf/i);
    expect(listItem).toBeInTheDocument();
  });
});
