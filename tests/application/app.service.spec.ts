import { AppService } from '../../src/application/app.service';

describe('App Service', () => {
  test("Should return 'Hello, Fingerwar!'", () => {
    const sut = new AppService().getHelloFingerwar();

    expect(sut).toEqual('Hello, Fingerwar!');
  });
});
