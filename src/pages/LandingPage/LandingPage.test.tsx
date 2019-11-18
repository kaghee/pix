import { createMemoryHistory } from 'history';
import React from 'react';
import renderer from 'react-test-renderer';

import LandingPage from './';

test('Renders without error', () => {
  const component = renderer.create(
    <LandingPage
      username=""
      history={createMemoryHistory()}
      updateUsername={() => {}}
      updateRoomName={() => {}}
    />,
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
