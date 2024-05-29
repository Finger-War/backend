import { GetOutQueueUseCase } from '@/application/usecases/get-out-queue-usecase';
import { InMemoryQueueRepository } from '@/infrastructure/repositories/in-memory-queue-repository';

const makeSut = () => {
  const inMemoryQueueRepository = new InMemoryQueueRepository();
  const sut = new GetOutQueueUseCase(inMemoryQueueRepository);

  return { sut, inMemoryQueueRepository };
};

describe('Get Out Queue Use Case', () => {
  it('Should not remove player from the game queue if player does not exist', () => {
    const { sut } = makeSut();

    const playerId = '1';

    expect(sut.execute(playerId)).toBeUndefined();
  });

  it('Should remove player from the game queue if player exist', () => {
    const { sut, inMemoryQueueRepository } = makeSut();

    const playerId = '1';
    inMemoryQueueRepository.joinQueue(playerId);

    sut.execute(playerId);

    expect(inMemoryQueueRepository.getPlayer(playerId)).toBeDefined();
  });
});
