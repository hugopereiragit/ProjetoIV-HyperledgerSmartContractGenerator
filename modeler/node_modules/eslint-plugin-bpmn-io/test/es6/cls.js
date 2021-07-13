import { Bar } from './bar';


export class Foo extends Bar {

  constructor(a, b, { c }) {
    super(a, c);
  }

  foo = (d) => {

    const blub = Blub.blub(...d);

    return {
      ...this.bar,
      blub,
      d
    };
  }

  longArgFn(
      hello, world,
      wowo, wooooooooorld) {

  }

}