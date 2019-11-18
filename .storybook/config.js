import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js (and other formats used inside the project)
configure(require.context('../src', true, /\.stories\.(js|ts)x?$/), module);
