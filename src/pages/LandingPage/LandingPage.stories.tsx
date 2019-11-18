import { action } from '@storybook/addon-actions';
import { text, withKnobs } from '@storybook/addon-knobs';
import { createMemoryHistory } from 'history';
import React from 'react';

import bg from '../../assets/images/blackhole.jpg';
import LandingPage from './';

export default {
  title: 'LandingPage',
  decorators: [withKnobs],
  parameters: {
    backgrounds: [
      { name: 'black', value: `black no-repeat center center/cover url(${bg})`, default: true },
    ],
  },
};

const landingPageActions = {
  updateUsername: action('updateUsername'),
  updateRoomName: action('updateRoomName'),
};

export const defaultRendering = () => (
  <LandingPage
    {...landingPageActions}
    username={text('Username', 'Kukor Ica')}
    history={createMemoryHistory()}
  />
);

defaultRendering.story = {
  name: 'Default rendering',
  notes: 'THE Default Rendering!',
};
