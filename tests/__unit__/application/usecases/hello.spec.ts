import { HelloUseCase } from '@/application/usecases/hello-usecase';

describe('Hello UseCase', () => {
  it("Should return 'Hello, Fingerwar!'", () => {
    const sut = new HelloUseCase().execute();

    expect(sut).toEqual('Hello, Fingerwar!');
  });
});
