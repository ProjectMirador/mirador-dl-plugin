import React from 'react';
import ManifestDownloadLinks from '../src/ManifestDownloadLinks';
import { render, screen } from './test-utils';

function createWrapper(props) {
  return render(
    <ManifestDownloadLinks
      classes={{}}
      renderings={[]}
      {...props}
    />,
  );
}

describe('ManifestDownloadLinks', () => {
  const renderings = [
    {
      id: 'http://example.com/abc123.pdf',
      getLabel: () => ({ getValue: () => 'Link to the PDF' }),
      getFormat: () => ({ value: 'application/pdf' }),
    },
    {
      id: 'http://example.com/abc123.txt',
      getLabel: () => ({ getValue: () => 'Link to the OCR' }),
      getFormat: () => ({ value: 'application/text' }),
    },
  ];

  it('renders the heading', () => {
    createWrapper({ renderings });

    screen.getByRole('heading');
    const headingElement = screen.getByText('Other download options');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H3');
  });

  it('renders a RenderingDownloadLink for each rendering', () => {
    createWrapper({ renderings });

    const pdfLinkElement = screen.getByRole('link', { name: /Link to the PDF/i });
    expect(pdfLinkElement).toBeInTheDocument();

    const ocrLinkElement = screen.getByRole('link', { name: /Link to the OCR/i });
    expect(ocrLinkElement).toBeInTheDocument();
  });
});
