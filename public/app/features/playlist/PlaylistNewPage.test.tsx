import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { locationService } from '@grafana/runtime';
import { backendSrv } from 'app/core/services/backend_srv';

import { PlaylistNewPage } from './PlaylistNewPage';
import { Playlist } from './types';

jest.mock('./api', () => ({
  // so we don't need to add dashboard items in test
  getDefaultPlaylist: jest.fn().mockReturnValue({
    items: [{ type: 'dashboard_by_uid', value: 'FirstUID' }],
    interval: '5m',
    name: '',
    uid: '',
  }),
}));

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getBackendSrv: () => backendSrv,
}));

jest.mock('app/core/components/TagFilter/TagFilter', () => ({
  TagFilter: () => {
    return <>mocked-tag-filter</>;
  },
}));

function getTestContext({ name, interval, items }: Partial<Playlist> = {}) {
  jest.clearAllMocks();
  const playlist = { name, items, interval } as unknown as Playlist;
  const backendSrvMock = jest.spyOn(backendSrv, 'post');

  const { rerender } = render(<PlaylistNewPage />);

  return { playlist, rerender, backendSrvMock };
}

describe('PlaylistNewPage', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('when mounted', () => {
    it('then header should be correct', () => {
      getTestContext();

      expect(screen.getByRole('heading', { name: /new playlist/i })).toBeInTheDocument();
    });
  });

  describe('when submitted', () => {
    it.skip('then correct api should be called', async () => {
      const { backendSrvMock } = getTestContext();

      expect(locationService.getLocation().pathname).toEqual('/');
      await userEvent.type(screen.getByRole('textbox', { name: /playlist name/i }), 'A new name');
      fireEvent.submit(screen.getByRole('button', { name: /save/i }));
      await waitFor(() => expect(backendSrvMock).toHaveBeenCalledTimes(1));
      expect(backendSrvMock).toHaveBeenCalledWith('/api/playlists', {
        name: 'A new name',
        interval: '5m',
        items: [{ type: 'dashboard_by_uid', value: 'FirstUID' }],
      });
      expect(locationService.getLocation().pathname).toEqual('/playlists');
    });
  });
});
