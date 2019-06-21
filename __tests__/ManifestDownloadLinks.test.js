import React from 'react';
import { shallow } from 'enzyme';
import Link from '@material-ui/core/Link';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ManifestDownloadLinks from '../src/ManifestDownloadLinks';

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
      getLabel: () => [{ value: 'Link to the PDF' }],
      getFormat: () => ({ value: 'application/pdf' }),
    },
    {
      id: 'http://example.com/abc123.txt',
      getLabel: () => [{ value: 'Link to the OCR' }],
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

  it('renders a Link for each rendering', () => {
    const wrapper = createWrapper({ renderings });

    expect(wrapper.find(Link).length).toBe(2);
  });

  it('links the label and includes the format (unlinked)', () => {
    const wrapper = createWrapper({ renderings });

    expect(wrapper.find(Link).at(0).props().children).toEqual('Link to the PDF');
    expect(wrapper.find(Link).at(0).props().href).toEqual('http://example.com/abc123.pdf');
    expect(wrapper.find(ListItemText).at(0).props().children[1]).toEqual(' (application/pdf)');
  });
});
