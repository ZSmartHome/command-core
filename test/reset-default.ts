import {light} from '../src';

light(`default`)
  .catch((e) => console.error(e))
  .then(() => console.log(`finished`));
