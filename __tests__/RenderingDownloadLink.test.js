import React from 'react';
import { shallow } from 'enzyme';
import Link from '@material-ui/core/Link';
import ListItemText from '@material-ui/core/ListItemText';
import RenderingDownloadLink from '../src/RenderingDownloadLink';

function createWrapper(props) {
  return shallow(
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
    const wrapper = createWrapper({ rendering });

    expect(wrapper.find(Link).length).toBe(1);
  });

  it('links the label and includes the format (unlinked)', () => {
    const wrapper = createWrapper({ rendering });

    expect(wrapper.find(Link).at(0).props().children).toEqual('Link to the PDF');
    expect(wrapper.find(Link).at(0).props().href).toEqual('http://example.com/abc123.pdf');
    expect(wrapper.find(ListItemText).at(0).props().children[1]).toEqual(' (application/pdf)');
  });
});
