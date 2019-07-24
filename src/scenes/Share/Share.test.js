import React from 'react';
import { cleanup, render, wait, fireEvent, getByTestId, act } from '@testing-library/react';
import Share from './Share';
import { SHARE_STATE, SHARE_PROVIDERS } from 'constants/sharing';
import gsuite from './services/gsuite';

jest.mock('./services/gsuite');

afterEach(cleanup);

describe('Share', () => {
  test('to gsuite', async () => {
    const setShare = jest.fn();
    const file = { name: 'a.tdf' };
    const { getByText, rerender } = render(
      <Share encrypted={file} recipients={['a', 'b']} setShare={setShare} />,
    );
    expect(getByText('Share a.tdf')).toBeInTheDocument();
    await wait(() => expect(gsuite.init).toHaveBeenCalled());

    gsuite.upload.mockReturnValue({ result: { id: 'fake-id' } });
    fireEvent.click(getByText('Google Drive'));
    // Make sure we are sharing with the expected recipients
    await wait(() => expect(gsuite.share).toHaveBeenCalledWith('fake-id', ['a', 'b']));
    // Make sure we update the share state after
    const doneState = {
      state: SHARE_STATE.SHARED,
      id: 'fake-id',
      link: 'https://drive.google.com/open?id=fake-id',
      recipients: ['a', 'b'],
    };
    await wait(() =>
      expect(setShare).toHaveBeenCalledWith({
        provider: SHARE_PROVIDERS.GOOGLEDRIVE,
        providerState: doneState,
      }),
    );
    const onClose = jest.fn();
    rerender(
      <Share
        share={SHARE_PROVIDERS.GOOGLEDRIVE}
        encrypted={file}
        recipients={['a', 'b']}
        providers={{ googledrive: doneState }}
        setShare={setShare}
        onClose={onClose}
      />,
    );
    fireEvent.click(getByText('Done'));
    await wait(() => expect(onClose).toHaveBeenCalled());
  });
});