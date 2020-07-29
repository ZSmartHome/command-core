import {light} from '../';

light(`default`)
  .catch((e) => console.error(e))
  .then(() => console.log(`finished`));
