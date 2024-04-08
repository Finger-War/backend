import { AppService } from '../../src/application/hello.service';

describe('App Service', () => {
  test("Should return 'Hello, Fingerwar!'", () => {
    const sut = new AppService().getHelloFingerwar();

    expect(sut).toEqual('Hello, Fingerwar!');
  });
});
