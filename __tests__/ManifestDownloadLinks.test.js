import React from 'react';
import { shallow } from 'enzyme';
import Typography from '@material-ui/core/Typography';
import ManifestDownloadLinks from '../src/ManifestDownloadLinks';
import RenderingDownloadLink from '../src/RenderingDownloadLink';

function createWrapper(props) {
  return shallow(
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
    const wrapper = createWrapper({ renderings });

    expect(
      wrapper.find(Typography)
        .find({ variant: 'h3' })
        .props().children,
    ).toEqual('Other download options');
  });

  it('renders a RenderingDownloadLink for each rendering', () => {
    const wrapper = createWrapper({ renderings });

    expect(wrapper.find(RenderingDownloadLink).length).toBe(2);
  });
});
