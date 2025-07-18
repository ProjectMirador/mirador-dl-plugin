import ManifestDownloadLinks from '../src/ManifestDownloadLinks';
import { render, screen } from './test-utils';

function createWrapper(props) {
  return render(
    <ManifestDownloadLinks
      classes={{}}
      renderings={[]}
      t={(k) => k}
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

  it('displays the heading "Other download options" as an H3 element', () => {
    createWrapper({ renderings });

    screen.getByRole('heading');
    const headingElement = screen.getByText('mirador-dl-plugin.other_download');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H3');
  });

  it('renders a download link for each item in the renderings list', () => {
    createWrapper({ renderings });

    const pdfLinkElement = screen.getByRole('link', { name: /Link to the PDF/i });
    expect(pdfLinkElement).toBeInTheDocument();

    const ocrLinkElement = screen.getByRole('link', { name: /Link to the OCR/i });
    expect(ocrLinkElement).toBeInTheDocument();
  });
});
